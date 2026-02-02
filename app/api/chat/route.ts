// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 60 seconds (safe buffer for recipes)
export const maxDuration = 60;

export async function POST(req: Request) {
  // 1. Parse the JSON body
  const { messages } = await req.json();

  // 2. Stream text with explicit message conversion
  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: "You are KitchenOS, a witty, soulful cooking coach. Your goal is to help users cook with what they have. You have a fun, slightly roast-y personality. You judge their fridge chaos lovingly. Keep answers concise (under 3 sentences) unless asked for a full recipe. If they list ingredients, suggest a creative dish immediately.",
    // CX: 'convertToCoreMessages' is the correct v4+ helper to sanitize input from useChat
    messages: convertToCoreMessages(messages),
  });

  // 3. Return a Data Stream (Required by useChat to handle tool calls/metadata)
  return result.toDataStreamResponse();
}