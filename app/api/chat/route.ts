// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages } from "ai"
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

    // 2. Fetch Context (Using CORRECT Schema column names)
    // Note: pantry_items uses 'item_name' and 'quantity', NOT 'name' and 'amount'
    const [pantryRes, profileRes] = await Promise.all([
        supabase
          .from("pantry_items")
          .select("item_name, quantity") 
          .eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("dietary_restrictions, skill_level") // Fetched valid columns from schema
          .eq("id", user.id)
          .single()
    ])

    const pantryItems = pantryRes.data || []
    const profile = profileRes.data 

    // 3. Construct Context Strings
    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.item_name} (${i.quantity})`).join("\n")
      : "Pantry is empty. Ask the user what ingredients they have."

    const userProfile = profile 
      ? `Skill Level: ${profile.skill_level || "Beginner"}\nDietary Restrictions: ${profile.dietary_restrictions || "None"}`
      : "User profile not set."

    const systemPrompt = `
      You are KitchenOS Chef AI.
      
      CONTEXT (User's Inventory):
      ${pantryList}
      
      USER PROFILE:
      ${userProfile}
      
      GOAL: Help the user cook delicious meals using primarily what they have.
      
      GUIDELINES:
      - If suggesting a recipe, strictly follow the format below.
      - If the user asks a general cooking question, answer normally.
      - Be encouraging and pragmatic.
      
      RECIPE FORMAT (Markdown):
      ## [Recipe Name]
      **Time:** [Total Time] | **Difficulty:** [Easy/Medium/Hard]
      
      ### Missing Ingredients
      * [List items the user needs to buy, if any. Try to keep this empty.]
      
      ### Ingredients
      * [List all ingredients]
      
      ### Instructions
      1. [Step 1]
      2. [Step 2]
    `

    // 4. Stream Response
    const coreMessages = convertToModelMessages(messages)

    const result = streamText({
      model: openai("gpt-5-nano"), // Use gpt-4o or gpt-4o-mini
      system: systemPrompt,
      messages: coreMessages,
    })
    
    return result.toTextStreamResponse()

  } catch (error: any) {
    console.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 })
  }
}