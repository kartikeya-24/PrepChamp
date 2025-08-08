'use server';

/**
 * @fileOverview An AI flow that solves a question from an image.
 *
 * - solveImageQuestion - A function that provides a step-by-step solution for a question in an image.
 * - SolveImageQuestionInput - The input type for the solveImageQuestion function.
 * - SolveImageQuestionOutput - The return type for the solveImageQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveImageQuestionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().optional().describe('An optional question to provide more context.'),
});
export type SolveImageQuestionInput = z.infer<typeof SolveImageQuestionInputSchema>;

const SolveImageQuestionOutputSchema = z.object({
  solution: z.string().describe('The step-by-step solution to the question in the image.'),
});
export type SolveImageQuestionOutput = z.infer<typeof SolveImageQuestionOutputSchema>;

export async function solveImageQuestion(input: SolveImageQuestionInput): Promise<SolveImageQuestionOutput> {
  return solveImageQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveImageQuestionPrompt',
  input: {schema: SolveImageQuestionInputSchema},
  output: {schema: SolveImageQuestionOutputSchema},
  prompt: `You are an expert problem solver for competitive exams. You will be given an image containing a question and an optional text prompt for more context.

Your task is to provide a clear, step-by-step solution to the problem shown in the image. If the image contains multiple questions, focus on the one that seems most relevant to the user's optional question, or the first one if no question is provided.

Explain each step of your reasoning.

User's optional question: {{{question}}}
Photo of the problem: {{media url=photoDataUri}}`,
});

const solveImageQuestionFlow = ai.defineFlow(
  {
    name: 'solveImageQuestionFlow',
    inputSchema: SolveImageQuestionInputSchema,
    outputSchema: SolveImageQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
