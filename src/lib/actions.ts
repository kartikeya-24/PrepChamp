'use server';

import { answerStudentDoubts as answerStudentDoubtsFlow } from '@/ai/flows/answer-student-doubts';
import type { AnswerStudentDoubtsInput } from '@/ai/flows/answer-student-doubts';

export async function askAiTrainer(input: AnswerStudentDoubtsInput) {
    try {
        const result = await answerStudentDoubtsFlow(input);
        return { success: true, answer: result.answer };
    } catch (error) {
        console.error("Error in AI trainer flow:", error);
        return { success: false, error: "Sorry, I couldn't process your question. Please try again." };
    }
}
