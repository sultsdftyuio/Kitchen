// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createClient } from "@/utils/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return new Response("Unauthorized", { status: 401 })

    // Fetch Context (Profile + Pantry)
    const [pantryRes, profileRes] = await Promise.all([
        supabase.from("pantry_items").select("name, amount, unit").eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("id", user.id).single()
    ])

    const pantryItems = pantryRes.data || []
    const profile = profileRes.data || {}

    // Context Strings
    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.name} (${i.amount} ${i.unit})`).join("\n")
      : "Pantry is empty."

    const equipment = profile.kitchen_equipment 
      ? `User's Equipment: ${profile.kitchen_equipment}` 
      : "User has standard kitchen equipment."

    const restrictions = profile.dietary_restrictions
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
      
      Actually, let's stick to rich Markdown for streaming speed, but structure it strictly:
      1. Title (H2)
      2. Time & Difficulty (Bold)
      3. Missing Ingredients (if any - IMPORTANT)
      4. Ingredients List (Bulleted)
      5. Step-by-Step Instructions (Numbered)
      
      If the user just chats, reply normally.
    `

    const result = streamText({
      model: openai("gpt-4o"), // Upgraded model for logic
      system: systemPrompt,
      messages,
    })
    
    return (result as any).toDataStreamResponse()

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}