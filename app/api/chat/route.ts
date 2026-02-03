// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 1. Fetch User Context (Pantry + Profile)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let pantryContext = "The user's pantry is currently empty.";
  let profileContext = "The user has no specific dietary restrictions.";
  let skillContext = "The user is an Intermediate cook.";

  if (user) {
    // A. Fetch Pantry
    const { data: pantryItems } = await supabase
      .from("pantry_items")
      .select("name, quantity")
      .eq("user_id", user.id);

    if (pantryItems && pantryItems.length > 0) {
      const inventory = pantryItems.map(item => `- ${item.name} (${item.quantity})`).join("\n");
      pantryContext = `Here is the user's CURRENT PANTRY INVENTORY:\n${inventory}`;
    }

    // B. Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("dietary_restrictions, skill_level")
      .eq("id", user.id)
      .single();

    if (profile) {
      if (profile.dietary_restrictions) {
        profileContext = `IMPORTANT: The user has these DIETARY RESTRICTIONS: ${profile.dietary_restrictions}. DO NOT suggest recipes that violate these.`;
      }
      if (profile.skill_level) {
        skillContext = `The user's cooking skill level is: ${profile.skill_level}. Adjust recipe complexity accordingly.`;
      }
    }
  }

  // 2. Convert messages
  const coreMessages = await convertToModelMessages(messages);

  // 3. Stream text with Enhanced System Prompt
  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    system: `
      You are KitchenOS, a world-class professional chef.
      
      USER CONTEXT:
      ${pantryContext}
      ${profileContext}
      ${skillContext}
      
      GUIDELINES:
      - If the user asks "What can I cook?", suggest 2-3 specific recipes using their pantry inventory that fit their diet and skill level.
      - If the user has strict dietary restrictions (e.g. Vegan), NEVER suggest animal products.
      - Keep answers concise (under 3-4 sentences) unless asked for a full recipe.
      - Be encouraging and warm.
    `,
    messages: coreMessages,
  });

  return result.toTextStreamResponse();
}