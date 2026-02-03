// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  const start = Date.now();
  console.log("--------------- START AI REQUEST ---------------");

  try {
    // 1. Debug: Check Request Body
    const body = await req.json();
    const { messages } = body;
    console.log(`1. Request received. Messages count: ${messages?.length}`);

    // 2. Debug: Check Environment Variables
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("❌ CRITICAL ERROR: GOOGLE_GENERATIVE_AI_API_KEY is missing from process.env");
      throw new Error("Server configuration error: Missing API Key");
    }
    console.log(`2. API Key Check: Present (Starts with: ${apiKey.substring(0, 4)}...)`);

    // 3. Debug: Supabase Connection
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.warn("⚠️ Auth Check: User not logged in or token invalid.", authError);
    } else {
      console.log(`3. Auth Check: User authenticated (${user.id})`);
    }

    // 4. Build Context
    let pantryContext = "The user's pantry is currently empty.";
    let profileContext = "The user has no specific dietary restrictions.";
    let skillContext = "The user is an Intermediate cook.";

    if (user) {
      // Fetch Pantry
      const { data: pantryItems, error: pantryError } = await supabase
        .from("pantry_items")
        .select("name, quantity")
        .eq("user_id", user.id);

      if (pantryError) {
        console.error("❌ Database Error (Pantry):", pantryError);
      } else if (pantryItems && pantryItems.length > 0) {
        console.log(`4. Pantry Data: Found ${pantryItems.length} items`);
        const inventory = pantryItems.map(item => `- ${item.name} (${item.quantity})`).join("\n");
        pantryContext = `Here is the user's CURRENT PANTRY INVENTORY:\n${inventory}`;
      } else {
        console.log("4. Pantry Data: Pantry is empty");
      }

      // Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("dietary_restrictions, skill_level")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // Ignore "Row not found" error
        console.error("❌ Database Error (Profile):", profileError);
      } else if (profile) {
        console.log("5. Profile Data: Found user profile");
        if (profile.dietary_restrictions) profileContext = `Dietary Restrictions: ${profile.dietary_restrictions}`;
        if (profile.skill_level) skillContext = `Skill Level: ${profile.skill_level}`;
      }
    }

    // 5. Stream Generation
    console.log("6. Initializing AI Stream with model: gemini-1.5-flash"); // Explicit logging

    // Using the stable 1.5 model for debugging reliability
    const model = google('gemini-1.5-flash'); 

    const result = streamText({
      model: model,
      system: `
        You are KitchenOS, a professional chef.
        DEBUG MODE: If asked, confirm you can see the pantry items.
        
        CONTEXT:
        ${pantryContext}
        ${profileContext}
        ${skillContext}
        
        Refuse to answer non-cooking questions. Keep it short.
      `,
      messages: await convertToModelMessages(messages),
      onFinish: (event) => {
        const duration = Date.now() - start;
        console.log(`✅ Stream Finished in ${duration}ms. Usage: ${JSON.stringify(event.usage)}`);
      },
    });

    console.log("7. Stream object created successfully. Returning response.");
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("❌ FATAL SERVER ERROR:", error);
    
    // Return a visible JSON error to the client
    return new Response(JSON.stringify({ 
      error: "Server Error", 
      details: error.message || "Unknown error",
      location: "app/api/chat/route.ts"
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" } 
    });
  }
}