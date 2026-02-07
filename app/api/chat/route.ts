// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages } from "ai"
import { createClient } from "@/utils/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[API/Chat ${requestId}] 🚀 POST request received`)

  try {
    // 0. Parse Body
    const body = await req.json()
    const { messages } = body
    console.log(`[API/Chat ${requestId}] 📨 Received ${messages?.length || 0} messages`)

    // 1. Auth Check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error(`[API/Chat ${requestId}] ❌ Auth Error or No User`, authError)
      return new Response("Unauthorized", { status: 401 })
    }

    // 2. Fetch Context
    console.log(`[API/Chat ${requestId}] 📦 Fetching Context for user ${user.id}...`)
    const [pantryRes, profileRes] = await Promise.all([
        supabase.from("pantry_items").select("name, quantity").eq("user_id", user.id),
        supabase.from("profiles").select("dietary_restrictions, skill_level").eq("id", user.id).single()
    ])

    const pantryItems = pantryRes.data || []
    const profile = profileRes.data 
    console.log(`[API/Chat ${requestId}] 🍎 Pantry items: ${pantryItems.length}`)

    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.name} (${i.quantity})`).join("\n")
      : "Pantry is empty. Ask the user what ingredients they have."

    const userProfile = profile 
      ? `Skill Level: ${profile.skill_level || "Beginner"}\nDietary Restrictions: ${profile.dietary_restrictions || "None"}`
      : "User profile not set."

    const systemPrompt = `
      You are KitchenOS Chef AI.
      CONTEXT (User's Inventory): ${pantryList}
      USER PROFILE: ${userProfile}
      GOAL: Help the user cook delicious meals using primarily what they have.
    `

    // 3. Prepare Messages
    // CRITICAL FIX: Added 'await' here.
    console.log(`[API/Chat ${requestId}] 🔄 Converting messages...`)
    const coreMessages = await convertToModelMessages(messages)

    // 4. Stream Response
    console.log(`[API/Chat ${requestId}] 🌊 Starting Stream (Model: gpt-5-nano)...`)
    
    const result = streamText({
      model: openai("gpt-5-nano"), 
      system: systemPrompt,
      messages: coreMessages,
      onFinish: (event) => {
        console.log(`[API/Chat ${requestId}] 🏁 Stream Finished. Tokens: ${event.usage.totalTokens}`)
      },
    })
    
    return result.toDataStreamResponse()

  } catch (error: any) {
    console.error(`[API/Chat ${requestId}] 💥 FATAL ERROR:`, error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 })
  }
}