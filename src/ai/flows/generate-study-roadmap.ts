'use server';

/**
 * @fileOverview An AI agent that generates a study roadmap for a given exam.
 *
 * - generateStudyRoadmap - A function that generates a study roadmap.
 * - GenerateStudyRoadmapInput - The input type for the generateStudyRoadmap function.
 * - GenerateStudyRoadmapOutput - The return type for the generateStudyRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyRoadmapInputSchema = z.object({
  examName: z.string().describe('The name of the exam for which to generate a study roadmap.'),
  currentKnowledgeLevel: z
    .string()
    .describe(
      'The current knowledge level of the student, e.g., beginner, intermediate, or advanced.'
    ),
});
export type GenerateStudyRoadmapInput = z.infer<typeof GenerateStudyRoadmapInputSchema>;

const GenerateStudyRoadmapOutputSchema = z.object({
  studyRoadmap: z.string().describe('The AI-generated study roadmap for the specified exam.'),
});
export type GenerateStudyRoadmapOutput = z.infer<typeof GenerateStudyRoadmapOutputSchema>;

export async function generateStudyRoadmap(
  input: GenerateStudyRoadmapInput
): Promise<GenerateStudyRoadmapOutput> {
  return generateStudyRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyRoadmapPrompt',
  input: {schema: GenerateStudyRoadmapInputSchema},
  output: {schema: GenerateStudyRoadmapOutputSchema},
  prompt: `You are an expert study roadmap generator. You will generate a study roadmap for a student based on the exam they are preparing for and their current knowledge level.

Exam Name: {{{examName}}}
Current Knowledge Level: {{{currentKnowledgeLevel}}}

Study Roadmap:`,
});

const generateStudyRoadmapFlow = ai.defineFlow(
  {
    name: 'generateStudyRoadmapFlow',
    inputSchema: GenerateStudyRoadmapInputSchema,
    outputSchema: GenerateStudyRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
