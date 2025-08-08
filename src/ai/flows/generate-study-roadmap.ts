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

const RoadmapStageSchema = z.object({
    stage: z.number().describe("The stage number of the roadmap."),
    name: z.string().describe("The name of the stage."),
    description: z.string().describe("A short description of the stage."),
    resources: z.array(z.string()).describe("A list of resources for this stage."),
    milestones: z.array(z.string()).describe("A list of milestones for this stage."),
});

const GenerateStudyRoadmapOutputSchema = z.object({
  roadmap: z.array(RoadmapStageSchema).describe("The AI-generated study roadmap for the specified exam."),
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

Generate a 4-stage roadmap.
`,
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
