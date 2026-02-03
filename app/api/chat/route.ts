// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from "@/utils/supabase/server";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Build Context (Pantry + Profile)
    // Base persona
    let systemInstructions = "You are KitchenOS, a caring, world-class professional chef. Your goal is to help users cook delicious meals with the ingredients they have available. You are encouraging, knowledgeable, and patient. You treat every ingredient with respect and offer professional techniques and tips like a mentor. Keep answers concise (under 3 sentences) unless asked for a full recipe. If they list ingredients, immediately suggest a creative, well-balanced dish that utilizes them.";
    
    if (user) {
      // FIXED: Changed 'name' to 'item_name' to match your DB schema
      const { data: pantry } = await supabase
        .from("pantry_items")
        .select("item_name, quantity")
        .eq("user_id", user.id);
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("dietary_restrictions, skill_level")
        .eq("id", user.id)
        .single();
      
      let contextParts = [];
      
      // FIXED: Map using 'item_name'
      if (pantry?.length) {
        contextParts.push(`PANTRY:\n${pantry.map(i => `- ${i.item_name} (${i.quantity})`).join("\n")}`);
      }
      
      if (profile?.dietary_restrictions) contextParts.push(`DIET: ${profile.dietary_restrictions}`);
      if (profile?.skill_level) contextParts.push(`SKILL: ${profile.skill_level}`);
      
      if (contextParts.length) {
        systemInstructions += `\n\nUSER CONTEXT:\n${contextParts.join("\n")}\n\nUse this context to suggest recipes.`;
      }
    }

    // 2. Attempt AI Generation
    try {
      const result = streamText({
        model: google('gemini-2.5-flash-lite'),
        system: systemInstructions,
        messages: await convertToModelMessages(messages),
      });

      // FIXED: Use toDataStreamResponse() for the correct AI SDK protocol
      return result.toTextStreamResponse();
      
    } catch (aiError: any) {
      // 3. Fallback: Manually return error as a stream message to prevent client crash
      console.error("❌ Google API Error:", aiError);
      
      const errorMessage = `I encountered an error connecting to my brain.\n\n**Details:** ${aiError.message || "Unknown Error"}\n\n*Check your API Key and Model Name.*`;
      
      // Manually construct a valid Data Stream response (0: = text part)
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