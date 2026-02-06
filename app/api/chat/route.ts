// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"
import { createClient } from "@/utils/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // 1. Auth Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // 2. Fetch Context
    const [pantryRes, profileRes] = await Promise.all([
        supabase
          .from("pantry_items")
          .select("name, amount, unit")
          .eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("kitchen_equipment, dietary_restrictions")
          .eq("id", user.id)
          .single()
    ])

    const pantryItems = pantryRes.data || []
    const profile = profileRes.data 

    // 3. Context Strings
    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.name || "Item"} (${i.amount || ""} ${i.unit || ""})`).join("\n")
      : "Pantry is empty."

    const equipment = profile?.kitchen_equipment 
      ? `User's Equipment: ${profile.kitchen_equipment}` 
      : "Standard home kitchen equipment."

    const restrictions = profile?.dietary_restrictions
      ? `Dietary Restrictions: ${profile.dietary_restrictions}`
      : "No dietary restrictions."

    const systemPrompt = `
      You are KitchenOS Chef AI.
      
      CONTEXT:
      ${pantryList}
      
      USER PROFILE:
      ${equipment}
      ${restrictions}
      
      GOAL: Help the user cook using ONLY what they have.
      
      CRITICAL OUTPUT FORMAT:
      If providing a recipe, you MUST output valid Markdown but use specific headers like "## Title", "### Ingredients", "### Instructions".
      
      Structure it strictly:
      1. Title (H2)
      2. Time & Difficulty (Bold)
      3. Missing Ingredients (if any - IMPORTANT)
      4. Ingredients List (Bulleted)
      5. Step-by-Step Instructions (Numbered)
      
      If the user just chats, reply normally.
    `

    // 4. Stream Response
    // FIX: Used convertToCoreMessages for AI SDK v6 compatibility
    const result = streamText({
      model: openai("gpt-5-nano"), // Kept as requested
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
    })
    
    return result.toTextStreamResponse()

  } catch (error: any) {
    console.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 })
  }
}