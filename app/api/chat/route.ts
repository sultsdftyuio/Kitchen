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
    if (messages && messages.length > 0) {
      console.log(`[API/Chat ${requestId}] Last message:`, messages[messages.length - 1])
    }

    // 1. Auth Check
    console.log(`[API/Chat ${requestId}] 🔐 Checking Auth...`)
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error(`[API/Chat ${requestId}] ❌ Auth Error:`, authError)
      return new Response(JSON.stringify({ error: "Auth Error" }), { status: 401 })
    }

    if (!user) {
      console.warn(`[API/Chat ${requestId}] ❌ No user found in session`)
      return new Response("Unauthorized", { status: 401 })
    }
    console.log(`[API/Chat ${requestId}] ✅ Authenticated User ID:`, user.id)

    // 2. Fetch Context (Safe Select)
    console.log(`[API/Chat ${requestId}] 📦 Fetching Pantry & Profile...`)
    const [pantryRes, profileRes] = await Promise.all([
        supabase
          .from("pantry_items")
          .select("name, quantity") // Ensure these columns exist in your DB
          .eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("dietary_restrictions, skill_level")
          .eq("id", user.id)
          .single()
    ])

    if (pantryRes.error) console.error(`[API/Chat ${requestId}] ⚠️ Pantry Fetch Error:`, pantryRes.error)
    if (profileRes.error) console.error(`[API/Chat ${requestId}] ⚠️ Profile Fetch Error:`, profileRes.error)

    const pantryItems = pantryRes.data || []
    const profile = profileRes.data 
    
    console.log(`[API/Chat ${requestId}] 🍎 Pantry Items Found:`, pantryItems.length)
    console.log(`[API/Chat ${requestId}] 👤 Profile Found:`, profile ? "Yes" : "No")

    // 3. Construct Context Strings
    const pantryList = pantryItems.length > 0
      ? pantryItems.map((i: any) => `- ${i.name} (${i.quantity})`).join("\n")
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
      
      RECIPE FORMAT (Markdown):
      ## [Recipe Name]
      **Time:** [Total Time] | **Difficulty:** [Easy/Medium/Hard]
      
      ### Ingredients
      * [List ingredients]
      
      ### Instructions
      1. [Step 1]
    `
    
    console.log(`[API/Chat ${requestId}] 🤖 System Prompt constructed (Length: ${systemPrompt.length})`)

    // 4. Stream Response
    console.log(`[API/Chat ${requestId}] 🌊 Starting Stream with model: gpt-5-nano`)
    const coreMessages = convertToModelMessages(messages)

    const result = streamText({
      model: openai("gpt-5-nano"), 
      system: systemPrompt,
      messages: coreMessages,
      onFinish: (event) => {
        console.log(`[API/Chat ${requestId}] 🏁 Stream Finished. Tokens: ${event.usage.totalTokens}`)
      },
    })
    
    // FIXED: Cast to 'any' to bypass the build error while using the correct Runtime method
    console.log(`[API/Chat ${requestId}] 📤 Returning DataStreamResponse`)
    return (result as any).toDataStreamResponse()

  } catch (error: any) {
    console.error(`[API/Chat ${requestId}] 💥 FATAL ERROR:`, error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 })
  }
}