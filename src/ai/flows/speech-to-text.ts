'use server';
/**
 * @fileOverview A Genkit flow for converting speech to text.
 *
 * - speechToText - Converts audio data into a text string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SpeechToTextInputSchema = z.object({
    audioDataUri: z.string().describe("A data URI of the user's spoken input. Expected format: 'data:audio/webm;base64,<encoded_data>'."),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SpeechToTextOutputSchema = z.object({
    text: z.string().describe("The transcribed text from the audio."),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;


export const speechToText = ai.defineFlow(
  {
    name: 'speechToText',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async ({ audioDataUri }) => {
    const { text } = await ai.generate({
      prompt: [
        { media: { url: audioDataUri } },
        { text: 'Transcribe the following audio.' },
      ],
    });
    return { text };
  }
);

export async function convertSpeechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
    return speechToText(input);
}
