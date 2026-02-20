// app/api/sous-chef/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, recipeContext } = await req.json();

    // The system prompt turns the AI into a strict, concise culinary expert.
    const systemPrompt = `
      You are Kernel, an expert AI Sous-Chef. 
      The user is currently cooking the following recipe: "${recipeContext.name}".
      Here are the instructions they are following: ${JSON.stringify(recipeContext.instructions)}.
      
      Rules:
      1. They are currently mid-cook. Give extremely concise, actionable, and urgent advice. No fluff.
      2. If they report a mistake (e.g., "my sauce broke", "it's too salty"), give the immediate culinary fix.
      3. If they ask for a substitution, provide exact measurements based on common pantry items.
      4. Do not output markdown lists if a single sentence will do. Fast, readable text only.
    `;

    const result = await streamText({
      model: openai('gpt-4o'), // Or your preferred model
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[Sous-Chef API] Error:", error);
    return new Response("Failed to fetch sous-chef response.", { status: 500 });
  }
}