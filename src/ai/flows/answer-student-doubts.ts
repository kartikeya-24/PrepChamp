// Implemented the Genkit flow for answering student doubts using a pre-defined prompt and Zod schemas.

'use server';

/**
 * @fileOverview A flow that answers student doubts and questions acting as a virtual trainer.
 *
 * - answerStudentDoubts - A function that handles answering student doubts.
 * - AnswerStudentDoubtsInput - The input type for the answerStudentDoubts function.
 * - AnswerStudentDoubtsOutput - The return type for the answerStudentDoubts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerStudentDoubtsInputSchema = z.object({
  question: z.string().describe('The student\u2019s question or doubt.'),
  context: z
    .string()
    .optional()
    .describe('Additional context or background information related to the question.'),
});
export type AnswerStudentDoubtsInput = z.infer<typeof AnswerStudentDoubtsInputSchema>;

const AnswerStudentDoubtsOutputSchema = z.object({
  answer: z.string().describe('The AI trainer’s answer to the student’s question.'),
});
export type AnswerStudentDoubtsOutput = z.infer<typeof AnswerStudentDoubtsOutputSchema>;

export async function answerStudentDoubts(input: AnswerStudentDoubtsInput): Promise<AnswerStudentDoubtsOutput> {
  return answerStudentDoubtsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerStudentDoubtsPrompt',
  input: {schema: AnswerStudentDoubtsInputSchema},
  output: {schema: AnswerStudentDoubtsOutputSchema},
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
    return output!;
  }
);
