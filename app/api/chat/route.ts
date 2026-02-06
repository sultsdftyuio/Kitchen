// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages } from "ai"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"

export const maxDuration = 30

// Define schema for incoming chat requests
const ChatRequestSchema = z.object({
  messages: z.array(z.any()), // basic validation that messages is an array
})

export async function POST(req: Request) {
  try {
    // 1. Input Validation
    const json = await req.json()
    const parseResult = ChatRequestSchema.safeParse(json)

    if (!parseResult.success) {
      return new Response("Invalid request body", { status: 400 })
    }

    const { messages } = parseResult.data

    // 2. Auth Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new Response("Unauthorized", { status: 401 })

    // 3. Fetch Context (Strict Selection)
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

    // Context Strings
    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.name} (${i.amount} ${i.unit})`).join("\n")
      : "Pantry is empty."

    const equipment = profile?.kitchen_equipment 
      ? `User's Equipment: ${profile.kitchen_equipment}` 
      : "User has standard kitchen equipment."

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
    const result = await streamText({
      model: openai("gpt-5-nano"), // Keeping your requested model
      system: systemPrompt,
      // await is required for convertToModelMessages in the new SDK
      messages: await convertToModelMessages(messages),
    })
    
    // FIX: Changed to toTextStreamResponse() as per your compiler error
    return result.toTextStreamResponse()

  } catch (error: any) {
    console.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 })
  }
}