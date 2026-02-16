// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages, tool } from "ai"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Schema for request validation
const ChatSchema = z.object({
  messages: z.array(z.any()),
})

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[API/Chat ${requestId}] 🚀 Request received`)

  try {
    // 1. Validate Body
    const json = await req.json()
    const { messages } = ChatSchema.parse(json)

    // 2. Auth Check & Setup
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.warn(`[API/Chat ${requestId}] ❌ Unauthorized`)
      return new Response("Unauthorized", { status: 401 })
    }

    // 3. Parallel Data Fetching (Context Enrichment)
    console.log(`[API/Chat ${requestId}] 📦 Fetching full context (Pantry, Profile, History)...`)
    
    const [pantryRes, profileRes, historyRes] = await Promise.all([
        // A. Get Inventory
        supabase
          .from("pantry_items")
          .select("name, quantity") 
          .eq("user_id", user.id),
        
        // B. Get User Preferences
        supabase
          .from("profiles")
          .select("dietary_restrictions, skill_level")
          .eq("id", user.id)
          .single(),

        // C. Get Taste Profile (Last 5 meals)
        supabase
          .from("cooking_history")
          .select("dish_name, rating, notes")
          .eq("user_id", user.id)
          .order("cooked_at", { ascending: false })
          .limit(5)
    ])

    // 4. Data Processing
    const pantryItems = pantryRes.data || []
    const profile = profileRes.data
    const history = historyRes.data || []

    // Format Pantry List
    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.name} (${i.quantity})`).join("\n")
      : "⚠️ Pantry is empty. Ask the user what ingredients they have on hand."

    // Format Cooking History
    const historyList = history.length > 0
      ? history.map((h: any) => `- ${h.dish_name} (${h.rating}/5 stars)${h.notes ? `: "${h.notes}"` : ""}`).join("\n")
      : "No cooking history yet."

    // Format Profile
    const skillLevel = profile?.skill_level || "Beginner"
    const dietary = profile?.dietary_restrictions || "None"

    // 5. Construct Advanced System Prompt
    const systemPrompt = `
      You are kernelcook Chef AI, a world-class culinary expert and encouraging coach.
      
      === 👤 USER PROFILE ===
      - **Skill Level:** ${skillLevel}
      - **Dietary Restrictions:** ${dietary} (STRICTLY OBSERVE THESE)
      
      === 🏠 KITCHEN INVENTORY ===
      The user currently has these items. PRIORITIZE using them to reduce waste:
      ${pantryList}

      === 🍽️ TASTE PREFERENCES (Recent History) ===
      ${historyList}

      === 🎯 YOUR GOAL & BEHAVIOR ===
      Help the user cook delicious meals using primarily what they have. 
      
      CRITICAL INSTRUCTION: Whenever the user asks for a recipe, or you decide to suggest a full recipe, you MUST use the \`generateRecipeCard\` tool. 
      Do NOT type out the recipe ingredients and instructions in standard markdown text. Call the tool so the UI can render a beautiful structured card!
      
      If you are just answering a general question (e.g., "how long to boil an egg", "what is a good substitute for butter"), just reply with normal encouraging text.
      
      === 📝 RESPONSE GUIDELINES ===
      1. **Tone:** Warm, encouraging, concise, and professional.
      2. **Safety:** If the user mentions dangerous combinations or allergens matching their profile, warn them immediately.
    `

    console.log(`[API/Chat ${requestId}] 🧠 System prompt built. History items: ${history.length}`)

    // 6. Prepare Messages using the correct SDK utility
    const coreMessages = convertToCoreMessages(messages)

    // 7. Stream Response with Tools enabled
    console.log(`[API/Chat ${requestId}] 🌊 Streaming response (gpt-5-nano)...`)
    
    const result = streamText({
      model: openai("gpt-5-nano"), // Strictly using the requested model
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.7,
      tools: {
        generateRecipeCard: tool({
          description: "Generates a structured, professional recipe card. ALWAYS use this when providing a full recipe instead of plain text.",
          parameters: z.object({
            name: z.string().describe("The name of the dish"),
            description: z.string().describe("A mouth-watering short description"),
            prepTime: z.string().describe("e.g. '15 mins'"),
            difficulty: z.enum(["Easy", "Medium", "Hard"]),
            ingredients: z.array(z.object({
              name: z.string(),
              amount: z.string().describe("e.g. '200g' or '1 cup'"),
              inPantry: z.boolean().describe("True if the user has this based on their pantry list")
            })),
            instructions: z.array(z.string()).describe("Step by step cooking instructions")
          }),
          execute: async (recipe) => {
            // Returning the recipe directly maps it to the frontend toolInvocation result
            return recipe;
          }
        })
      },
      onFinish: (event) => {
        console.log(`[API/Chat ${requestId}] 🏁 Stream completed. Usage: ${event.usage.totalTokens} tokens.`)
      },
    })
    
    return result.toDataStreamResponse()

  } catch (error: any) {
    console.error(`[API/Chat ${requestId}] 💥 Error:`, error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}