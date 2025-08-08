'use server';

/**
 * @fileOverview A flow that answers student doubts and questions acting as a virtual trainer, with text-to-speech capability.
 *
 * - answerStudentDoubts - A function that handles answering student doubts.
 * - AnswerStudentDoubtsInput - The input type for the answerStudentDoubts function.
 * - AnswerStudentDoubtsOutput - The return type for the answerStudentDoubts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { textToSpeech } from './text-to-speech';

const AnswerStudentDoubtsInputSchema = z.object({
  question: z.string().describe('The student’s question or doubt.'),
  context: z
    .string()
    .optional()
    .describe('Additional context or background information related to the question.'),
});
export type AnswerStudentDoubtsInput = z.infer<typeof AnswerStudentDoubtsInputSchema>;

const AnswerStudentDoubtsOutputSchema = z.object({
  answer: z.string().describe('The AI trainer’s answer to the student’s question.'),
  audioDataUri: z.string().describe("A data URI of the AI's spoken answer. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type AnswerStudentDoubtsOutput = z.infer<typeof AnswerStudentDoubtsOutputSchema>;

export async function answerStudentDoubts(input: AnswerStudentDoubtsInput): Promise<AnswerStudentDoubtsOutput> {
  return answerStudentDoubtsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerStudentDoubtsPrompt',
  input: {schema: AnswerStudentDoubtsInputSchema},
  output: {schema: z.object({
    answer: z.string().describe('The AI trainer’s answer to the student’s question.'),
  })},
  prompt: `You are an AI trainer for competitive exams. A student will ask you a question, and you should provide a clear and concise answer.

  Question: {{{question}}}
  Context: {{{context}}}
  `,
});

const answerStudentDoubtsFlow = ai.defineFlow(
  {
    name: 'answerStudentDoubtsFlow',
    inputSchema: AnswerStudentDoubtsInputSchema,
    outputSchema: AnswerStudentDoubtsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI.");
    }
    const { media } = await textToSpeech(output.answer);

    return {
      answer: output.answer,
      audioDataUri: media,
    };
  }
);
