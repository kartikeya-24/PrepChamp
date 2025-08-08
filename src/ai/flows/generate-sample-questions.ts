'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating sample questions on a specific topic for a given exam.
 *
 * - generateTopicQuestions - A function that generates practice questions on a particular topic based on the exam that the user is training for.
 * - GenerateTopicQuestionsInput - The input type for the generateTopicQuestions function.
 * - GenerateTopicQuestionsOutput - The return type for the generateTopicQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicQuestionsInputSchema = z.object({
  examName: z.string().describe('The name of the exam for which questions are being generated.'),
  topic: z.string().describe('The specific topic for which questions should be generated.'),
  numQuestions: z
    .number()
    .int()
    .positive()
    .default(5)
    .describe('The number of questions to generate.'),
});
export type GenerateTopicQuestionsInput = z.infer<typeof GenerateTopicQuestionsInputSchema>;

const GenerateTopicQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated practice questions.'),
});
export type GenerateTopicQuestionsOutput = z.infer<typeof GenerateTopicQuestionsOutputSchema>;

export async function generateTopicQuestions(input: GenerateTopicQuestionsInput): Promise<GenerateTopicQuestionsOutput> {
  return generateTopicQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicQuestionsPrompt',
  input: {schema: GenerateTopicQuestionsInputSchema},
  output: {schema: GenerateTopicQuestionsOutputSchema},
  prompt: `You are an expert in creating practice questions for competitive exams.

  Generate {{numQuestions}} practice questions for the {{examName}} exam, specifically on the topic of {{topic}}.
  The questions should be challenging and representative of the actual exam.

  Format each question as a single string in the output array.
  `,
});

const generateTopicQuestionsFlow = ai.defineFlow(
  {
    name: 'generateTopicQuestionsFlow',
    inputSchema: GenerateTopicQuestionsInputSchema,
    outputSchema: GenerateTopicQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
