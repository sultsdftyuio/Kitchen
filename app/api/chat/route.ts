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

    // 2. Supabase Setup
    const supabase = await createClient()

    // 3. Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return new Response("Unauthorized: Please log in again.", { status: 401 })
    }

    // 4. Fetch Pantry Context (Strict Filtering)
    const { data: pantryItems, error: dbError } = await supabase
      .from("pantry_items")
      .select("item_name, quantity") 
      .eq("user_id", user.id)
      .not("item_name", "is", null) // Critical fix
      .neq("item_name", "")

    if (dbError) {
      return new Response("Database connection failed", { status: 500 })
    }

    // 5. Construct System Prompt
    const validItems = pantryItems?.filter(i => i.item_name) || []
    
    const pantryContext = validItems.length > 0
      ? validItems.map(i => `- ${i.item_name} (${i.quantity})`).join("\n")
      : "Pantry is empty. Ask the user what ingredients they have."
    
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

    // 6. Stream Response
    console.log("6. Initializing OpenAI stream with model: gpt-5-nano")
    
    const result = streamText({
      model: openai("gpt-5-nano"),
      system: systemPrompt,
      messages,
    })
    
    console.log("✅ 7. Stream created successfully.")
    
    // ----------------------------------------------------------------------
    // ROBUST RESPONSE HANDLING (Polyfill for Version Mismatch)
    // ----------------------------------------------------------------------
    
    if (typeof (result as any).toDataStreamResponse === 'function') {
        return (result as any).toDataStreamResponse()
    }

    // Polyfill for older AI SDKs
    // @ts-ignore
    const textStream = result.textStream || (result as any).fullStream

    if (!textStream) {
       throw new Error("Could not extract stream from result")
    }

    const transformedStream = new ReadableStream({
        async start(controller) {
            const reader = textStream.getReader()
            try {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    if (value) {
                        const formatted = `0:${JSON.stringify(value)}\n`
                        controller.enqueue(new TextEncoder().encode(formatted))
                    }
                }
            } finally {
                reader.releaseLock()
                controller.close()
            }
        }
    })

    return new Response(transformedStream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Vercel-AI-Data-Stream": "v1"
        }
    })

  } catch (error: any) {
    console.error("--------------- CRITICAL API ERROR ---------------")
    console.error(error)

    return new Response(JSON.stringify({ 
      error: "Server processing failed.", 
      details: error.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}