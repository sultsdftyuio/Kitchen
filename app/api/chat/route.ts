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
  // switched to 'gemini-2.5-flash-lite' per strict constraints for Flash-Lite
  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    system: "You are KitchenOS, a caring, world-class professional chef. Your goal is to help users cook delicious meals with the ingredients they have available. You are encouraging, knowledgeable, and patient. You treat every ingredient with respect and offer professional techniques and tips like a mentor. Keep answers concise (under 3 sentences) unless asked for a full recipe. If they list ingredients, immediately suggest a creative, well-balanced dish that utilizes them.",
    messages: coreMessages,
  });

  // 4. Return the data stream response
  return result.toTextStreamResponse();
}