// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from "@/utils/supabase/server";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const start = Date.now();
  console.log("--------------- START AI REQUEST (GEMINI 2.5) ---------------");

  try {
    const { messages } = await req.json();

    // 1. Fetch User Context
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let pantryContext = "The user's pantry is currently empty.";
    let profileContext = "The user has no specific dietary restrictions.";
    let skillContext = "The user is an Intermediate cook.";

    if (user) {
      // Fetch Pantry
      const { data: pantryItems } = await supabase
        .from("pantry_items")
        .select("name, quantity")
        .eq("user_id", user.id);

      if (pantryItems && pantryItems.length > 0) {
        const inventory = pantryItems.map(item => `- ${item.name} (${item.quantity})`).join("\n");
        pantryContext = `Here is the user's CURRENT PANTRY INVENTORY:\n${inventory}`;
      }

      // Fetch Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("dietary_restrictions, skill_level")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (profile.dietary_restrictions) profileContext = `Dietary Restrictions: ${profile.dietary_restrictions}`;
        if (profile.skill_level) skillContext = `Skill Level: ${profile.skill_level}`;
      }
    }

    console.log("Context loaded. Initializing Gemini 2.5 Flash-Lite...");

    // 2. Stream Text using GEMINI 2.5 FLASH-LITE
    const result = streamText({
      model: google('gemini-2.5-flash-lite'), // <--- UPDATED AS REQUESTED
      system: `
        You are KitchenOS, a world-class professional chef.
        
        CONTEXT:
        ${pantryContext}
        ${profileContext}
        ${skillContext}
        
        GOAL:
        Suggest a creative recipe using the pantry items listed above.
        Refuse to answer non-cooking questions. Keep it short and encouraging.
      `,
      messages: await convertToModelMessages(messages),
      onFinish: (event) => {
        console.log(`✅ Stream Finished. Usage: ${JSON.stringify(event.usage)}`);
      },
    });

    return result.toTextStreamResponse();
    
  } catch (error: any) {
    console.error("❌ AI ROUTE ERROR:", error);
    
    // Provide a clear error to the UI
    return new Response(JSON.stringify({ 
      error: "AI Generation Failed", 
      details: error.message,
      model: "gemini-2.5-flash-lite"
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" } 
    });
  }
}