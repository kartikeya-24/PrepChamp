'use server';

import { answerStudentDoubts as answerStudentDoubtsFlow } from '@/ai/flows/answer-student-doubts';
import type { AnswerStudentDoubtsInput } from '@/ai/flows/answer-student-doubts';
import { generateTopicQuestions as generateTopicQuestionsFlow, GenerateTopicQuestionsInput, GenerateTopicQuestionsOutput } from '@/ai/flows/generate-sample-questions';
import { evaluateMockTest as evaluateMockTestFlow, EvaluateMockTestInput, EvaluateMockTestOutput } from '@/ai/flows/evaluate-mock-test';

export async function askAiTrainer(input: AnswerStudentDoubtsInput) {
    try {
        const result = await answerStudentDoubtsFlow(input);
        return { success: true, answer: result.answer };
    } catch (error) {
        console.error("Error in AI trainer flow:", error);
        return { success: false, error: "Sorry, I couldn't process your question. Please try again." };
    }
}


export async function generateQuestions(input: GenerateTopicQuestionsInput): Promise<{success: true, data: GenerateTopicQuestionsOutput} | {success: false, error: string}> {
    try {
        const result = await generateTopicQuestionsFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in generate questions flow:", error);
        return { success: false, error: "Sorry, I couldn't generate questions. Please try again." };
    }
}

export async function evaluateTest(input: EvaluateMockTestInput): Promise<{success: true, data: EvaluateMockTestOutput} | {success: false, error: string}> {
    try {
        const result = await evaluateMockTestFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in evaluate test flow:", error);
        return { success: false, error: "Sorry, I couldn't evaluate your test. Please try again." };
    }
}
