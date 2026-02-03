// app/api/chat/route.ts
import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { createClient } from "@/utils/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const supabase = await createClient()

    // 1. Verify User (This was likely crashing due to bad env vars)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("Auth Error:", authError)
      return new Response("Unauthorized: Please log in again.", { status: 401 })
    }

    // 2. Fetch Pantry Context
    const { data: pantryItems, error: dbError } = await supabase
      .from("pantry_items")
      .select("item_name, quantity") 
      .eq("user_id", user.id)

    if (dbError) {
      console.error("Database Error:", dbError)
      return new Response("Database connection failed", { status: 500 })
    }

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
    // kept your model choice as it is valid for 2026
    const result = streamText({
      model: google("gemini-2.5-flash-lite"), 
      system: systemPrompt,
      messages,
    })

    return result.toTextStreamResponse()

  } catch (error) {
    console.error("CRITICAL API ERROR:", error)
    // Return a JSON error that the client can handle, rather than crashing
    return new Response(JSON.stringify({ error: "Server processing failed." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}