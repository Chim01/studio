'use server';
/**
 * @fileOverview Basic chat support AI flow for TecoTransit.
 *
 * - chatSupport - Handles generating responses for chat support.
 * - ChatSupportInput - Input type for the chatSupport function.
 * - ChatSupportOutput - Return type for the chatSupport function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define the input schema for the chat support flow
const ChatSupportInputSchema = z.object({
  userMessage: z.string().describe('The message sent by the user to the support chat.'),
  history: z.array(z.object({ role: z.enum(['user', 'model']), content: z.string()})).optional().describe('Optional chat history')
});
export type ChatSupportInput = z.infer<typeof ChatSupportInputSchema>;

// Define the output schema for the chat support flow
const ChatSupportOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user\'s message.'),
});
export type ChatSupportOutput = z.infer<typeof ChatSupportOutputSchema>;

// Exported wrapper function to call the Genkit flow
export async function chatSupport(input: ChatSupportInput): Promise<ChatSupportOutput> {
  return chatSupportFlow(input);
}

// Define the Genkit prompt
const supportPrompt = ai.definePrompt(
  {
    name: 'chatSupportPrompt',
    input: { schema: ChatSupportInputSchema },
    output: { schema: ChatSupportOutputSchema },
    prompt: `You are a friendly and helpful support agent for "TecoTransit", a campus ride-booking app.
    Your goal is to assist users with their questions about the service.
    Be concise and helpful. If you don't know the answer, politely say so.

    Chat History:
    {{#if history}}
      {{#each history}}
        {{#if (eq role 'user')}}User: {{content}}{{/if}}
        {{#if (eq role 'model')}}Support: {{content}}{{/if}}
      {{/each}}
    {{/if}}

    Current User Message: {{{userMessage}}}

    Response:`,
  },
);


// Define the Genkit flow
const chatSupportFlow = ai.defineFlow<typeof ChatSupportInputSchema, typeof ChatSupportOutputSchema>(
  {
    name: 'chatSupportFlow',
    inputSchema: ChatSupportInputSchema,
    outputSchema: ChatSupportOutputSchema,
  },
  async (input) => {
     const llmResponse = await supportPrompt(input);
     const output = llmResponse.output;

    if (!output) {
       throw new Error("AI failed to generate a response.");
    }

    return output;

  }
);
