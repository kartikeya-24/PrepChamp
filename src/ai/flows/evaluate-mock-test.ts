'use server';

/**
 * @fileOverview A Genkit flow for evaluating a student's mock test performance.
 *
 * - evaluateMockTest - A function that evaluates the test and provides a score and feedback.
 * - EvaluateMockTestInput - The input type for the evaluateMockTest function.
 * - EvaluateMockTestOutput - The return type for the evaluateMockTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluatedQuestionSchema = z.object({
    questionText: z.string(),
    options: z.array(z.string()),
    correctAnswerIndex: z.number(),
    userAnswerIndex: z.number().nullable(),
});

const EvaluateMockTestInputSchema = z.object({
  questions: z.array(EvaluatedQuestionSchema).describe('The list of questions with user answers.')
});
export type EvaluateMockTestInput = z.infer<typeof EvaluateMockTestInputSchema>;

const EvaluateMockTestOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('The final score as a percentage.'),
  feedback: z.string().describe('Personalized feedback for the student based on their performance.'),
});
export type EvaluateMockTestOutput = z.infer<typeof EvaluateMockTestOutputSchema>;

export async function evaluateMockTest(input: EvaluateMockTestInput): Promise<EvaluateMockTestOutput> {
  return evaluateMockTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateMockTestPrompt',
  input: {schema: EvaluateMockTestInputSchema},
  output: {schema: EvaluateMockTestOutputSchema},
  prompt: `You are an expert AI evaluator for competitive exams. A student has just completed a mock test.
  
  You will be given a list of questions, each with the correct answer index and the user's selected answer index.
  First, calculate the score as a percentage of correct answers. A question is correct if userAnswerIndex equals correctAnswerIndex.
  
  Then, provide personalized, encouraging, and constructive feedback based on the user's performance. The feedback should be a concise paragraph (2-3 sentences).
  
  Here is the test data:
  {{#each questions}}
  - Question: "{{questionText}}"
    Correct Answer Index: {{correctAnswerIndex}}
    User Answer Index: {{#if userAnswerIndex}}{{userAnswerIndex}}{{else}}Not Answered{{/if}}
  {{/each}}
  `,
});

const evaluateMockTestFlow = ai.defineFlow(
  {
    name: 'evaluateMockTestFlow',
    inputSchema: EvaluateMockTestInputSchema,
    outputSchema: EvaluateMockTestOutputSchema,
  },
  async (input) => {
    
    const correctAnswers = input.questions.filter(q => q.userAnswerIndex === q.correctAnswerIndex).length;
    const totalQuestions = input.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // We can call the LLM for feedback, but for now we'll just calculate score here.
    // Let's call the LLM for feedback and combine it with the calculated score.
    const llmResponse = await prompt(input);
    
    if (llmResponse.output) {
         return {
            score,
            feedback: llmResponse.output.feedback
         }
    }

    // Fallback if LLM fails
    return {
      score,
      feedback: "Great effort on the test! Keep practicing to improve your score. Review the incorrect answers to understand your mistakes."
    };
  }
);
