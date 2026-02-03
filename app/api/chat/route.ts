// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Build Context (Pantry + Profile)
    let systemInstructions = `You are KitchenOS, a professional chef.`;
    
    if (user) {
      const { data: pantry } = await supabase.from("pantry_items").select("name, quantity").eq("user_id", user.id);
      const { data: profile } = await supabase.from("profiles").select("dietary_restrictions, skill_level").eq("id", user.id).single();
      
      let contextParts = [];
      if (pantry?.length) contextParts.push(`PANTRY:\n${pantry.map(i => `- ${i.name} (${i.quantity})`).join("\n")}`);
      if (profile?.dietary_restrictions) contextParts.push(`DIET: ${profile.dietary_restrictions}`);
      if (profile?.skill_level) contextParts.push(`SKILL: ${profile.skill_level}`);
      
      if (contextParts.length) {
        systemInstructions += `\n\nUSER CONTEXT:\n${contextParts.join("\n")}\n\nUse this context to suggest recipes.`;
      }
    }

    // 2. Attempt AI Generation
    // We try/catch INSIDE the stream generation to handle model errors gracefully
    try {
      const result = streamText({
        model: google('gemini-2.5-flash-lite'), // Keeping your requested model
        system: systemInstructions,
        messages: await convertToModelMessages(messages),
      });
      return result.toTextStreamResponse();
      
    } catch (aiError: any) {
      // 3. Fallback: If the specific model fails, we manually return the error as a chat message
      // This prevents "No separator found" client crash
      console.error("❌ Google API Error:", aiError);
      
      const errorMessage = `I encountered an error connecting to my brain.\n\n**Details:** ${aiError.message || "Unknown Error"}\n\n*Check your API Key and Model Name.*`;
      
      // Manually construct a valid AI Stream response
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(errorMessage)}\n`));
          controller.close();
        },
      });

      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

  } catch (serverError: any) {
    console.error("❌ Server Error:", serverError);
    return new Response(JSON.stringify({ error: serverError.message }), { status: 500 });
  }
}