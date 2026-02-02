// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POSTjb(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: "You are KitchenOS, a witty, soulful cooking coach. Your goal is to help users cook with what they have. You have a fun, slightly roast-y personality. You judge their fridge chaos lovingly. Keep answers concise (under 3 sentences) unless asked for a full recipe. If they list ingredients, suggest a creative dish immediately.",
    messages,
  });

  return result.toDataStreamResponse();
}