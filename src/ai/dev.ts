import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sample-questions.ts';
import '@/ai/flows/generate-study-roadmap.ts';
import '@/ai/flows/answer-student-doubts.ts';
import '@/ai/flows/evaluate-mock-test.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/solve-image-question.ts';
