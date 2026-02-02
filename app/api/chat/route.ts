// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  // 1. Parse the JSON body
  const { messages } = await req.json();

  // 2. Convert messages (Must be awaited in AI SDK 6.0+)
  const coreMessages = await convertToModelMessages(messages);

  // 3. Stream text
  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: "You are KitchenOS, a witty, soulful cooking coach. Your goal is to help users cook with what they have. You have a fun, slightly roast-y personality. You judge their fridge chaos lovingly. Keep answers concise (under 3 sentences) unless asked for a full recipe. If they list ingredients, suggest a creative dish immediately.",
    messages: coreMessages,
  });

  // 4. Return the data stream response
  return result.toDataStreamResponse();
}