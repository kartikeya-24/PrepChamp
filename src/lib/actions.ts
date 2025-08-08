'use server';

import { answerStudentDoubts as answerStudentDoubtsFlow } from '@/ai/flows/answer-student-doubts';
import type { AnswerStudentDoubtsInput, AnswerStudentDoubtsOutput } from '@/ai/flows/answer-student-doubts';
import { generateTopicQuestions as generateTopicQuestionsFlow, GenerateTopicQuestionsInput, GenerateTopicQuestionsOutput } from '@/ai/flows/generate-sample-questions';
import { evaluateMockTest as evaluateMockTestFlow, EvaluateMockTestInput, EvaluateMockTestOutput } from '@/ai/flows/evaluate-mock-test';
import { convertSpeechToText as speechToTextFlow, SpeechToTextInput, SpeechToTextOutput } from '@/ai/flows/speech-to-text';

import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { z } from 'zod';


export async function askAiTrainer(input: AnswerStudentDoubtsInput): Promise<{success: true, answer: string, audioDataUri?: string} | {success: false, error: string}> {
    try {
        const result = await answerStudentDoubtsFlow(input);
        return { success: true, answer: result.answer, audioDataUri: result.audioDataUri };
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

export async function convertSpeechToText(input: SpeechToTextInput): Promise<{success: true, data: SpeechToTextOutput} | {success: false, error: string}> {
    try {
        const result = await speechToTextFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in speech to text flow:", error);
        return { success: false, error: "Sorry, I couldn't process your voice input. Please try again." };
    }
}


const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});
export async function signUp(values: z.infer<typeof SignUpSchema>): Promise<{ success: true; } | { success: false; error: string; }> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await updateFirebaseProfile(userCredential.user, {
            displayName: values.name,
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export async function signIn(values: z.infer<typeof SignInSchema>): Promise<{ success: true; } | { success: false; error: string; }> {
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});
export async function updateProfile(values: z.infer<typeof UpdateProfileSchema>): Promise<{ success: true; } | { success: false; error: string; }> {
    try {
        if (!auth.currentUser) {
            throw new Error("You must be logged in to update your profile.");
        }
        await updateFirebaseProfile(auth.currentUser, {
            displayName: values.name,
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
