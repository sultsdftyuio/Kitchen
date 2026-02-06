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

    // 4. Fetch Pantry Context (Fixed: Uses 'name' column & filters nulls)
    const { data: pantryItems, error: dbError } = await supabase
      .from("pantry_items") 
      .select("name, quantity") 
      .eq("user_id", user.id)
      .not("name", "is", null)  // Filter out corrupted data
      .neq("name", "")          // Filter out empty strings

    if (dbError) {
      console.error("Context Fetch Error:", dbError)
      return new Response("Database connection failed", { status: 500 })
    }

    // 5. Construct System Prompt
    // Map the 'name' column correctly
    const validItems = pantryItems?.filter((i: any) => i.name) || []
    
    const pantryContext = validItems.length > 0
      ? validItems.map((i: any) => `- ${i.name} (${i.quantity})`).join("\n")
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
    // ROBUST RESPONSE HANDLING
    // ----------------------------------------------------------------------
    
    // Check if the modern method exists (SDK v6+)
    if (typeof (result as any).toDataStreamResponse === 'function') {
        return (result as any).toDataStreamResponse()
    }

    // Fallback: If running on older SDK, manually format as Data Stream Protocol
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
                    // Format as Data Stream Part 0 (Text)
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