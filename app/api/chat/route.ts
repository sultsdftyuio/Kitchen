// app/api/chat/route.ts
import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { createClient } from "@/utils/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const supabase = await createClient()

  // 1. Verify User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 2. Fetch Pantry Context
  const { data: pantryItems } = await supabase
    .from("pantry_items")
    .select("item_name, quantity") // Only fetch what we need
    .eq("user_id", user.id)

  // 3. Construct System Prompt
  const pantryContext = pantryItems?.map(i => `- ${i.item_name} (${i.quantity})`).join("\n") || "Pantry is empty."
  
  const systemPrompt = `
    You are Chef AI, a helpful, witty, and encouraging culinary expert.
    
    User's Current Pantry Inventory:
    ${pantryContext}
    
    GOAL: Help the user cook using ONLY what they have if possible.
    
    GUIDELINES:
    - If asked for a recipe, prioritize ingredients listed in the pantry.
    - If they are missing ingredients for a requested dish, clearly state what they need to buy.
    - Be concise. Use bullet points for instructions.
    - Use emojis (🥑, 🍳, 🔥) to keep it friendly.
    - If the user asks "What can I cook?", suggest 2-3 specific dishes based strictly on their inventory.
  `

  // 4. Stream Response
  const result = streamText({
    model: google("gemini-2.5-flash-lite"), // Updated to Gemini 2.5 Flash-Lite
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}