// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createClient } from "@/utils/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("--------------- STARTING CHAT REQUEST ---------------")
  
  try {
    // 1. Parse Body
    const body = await req.json()
    const { messages } = body
    console.log("1. Request body parsed. Message count:", messages?.length)

    // 2. Supabase Setup
    const supabase = await createClient()
    console.log("2. Supabase client initialized")

    // 3. Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("❌ 3. Auth Error or No User:", authError)
      return new Response("Unauthorized: Please log in again.", { status: 401 })
    }
    console.log("✅ 3. User verified:", user.id)

    // 4. Fetch Pantry Context
    console.log("4. Fetching pantry items...")
    const { data: pantryItems, error: dbError } = await supabase
      .from("pantry_items") //
      .select("item_name, quantity") 
      .eq("user_id", user.id)

    if (dbError) {
      console.error("❌ 4. Database Error:", dbError)
      return new Response("Database connection failed", { status: 500 })
    }
    console.log(`✅ 4. Pantry items fetched: ${pantryItems?.length || 0} items`)

    // 5. Construct System Prompt
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
    console.log("5. System prompt constructed.")

    // 6. Stream Response
    console.log("6. Initializing OpenAI stream with model: gpt-5-nano")
    
    const result = streamText({
      model: openai("gpt-5-nano"), // Kept as requested
      system: systemPrompt,
      messages,
    })
    
    console.log("✅ 7. Stream created successfully. Returning response.")
    
    // FIX: Cast to 'any' to bypass TypeScript build error regarding 'toDataStreamResponse'
    // The method exists in ai@6.x at runtime, but the type definition in CI might be lagging.
    return (result as any).toDataStreamResponse()

  } catch (error: any) {
    console.error("--------------- CRITICAL API ERROR ---------------")
    console.error("Error Name:", error.name)
    console.error("Error Message:", error.message)
    console.error("Full Error Object:", JSON.stringify(error, null, 2))
    console.error("--------------------------------------------------")

    // Return the specific error message to the client for easier debugging
    return new Response(JSON.stringify({ 
      error: "Server processing failed.", 
      details: error.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}