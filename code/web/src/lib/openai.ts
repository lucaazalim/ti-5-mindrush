"use server";

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { aiGeneratedSchema } from '~/app/dashboard/quizzes/form-schema';
import { QUESTION_TYPES } from "./constants";
import { z } from 'zod';


const questionAndAlternativesParserOpenAI = z.object({
    questions: z.array(
      z.object({
        question: z.string().min(1),
        type: z.enum(QUESTION_TYPES),
        timeLimit: z.number().min(5).max(120),
        order: z.number(),
        alternatives: z.array(z.string()),
        correctAlternativeIndex: z.number(),
      }),
    ),
  });

export async function generateQuizByTheme(quiz: z.infer<typeof aiGeneratedSchema>){

    const quantityQuestions = 2;
  
    const {object} = await generateObject({
        model: openai('gpt-4.1-nano'),
        maxTokens: 500,
        schema: questionAndAlternativesParserOpenAI,
        messages: [
            {
                role: 'user',
                content: `Crie um quiz de ${quiz.title} sobre ${quiz.theme} com ${quiz.difficulty} dificuldade em ${quiz.language}, contendo ${quantityQuestions} questoes com 4 alternativas somente uma delas sendo verdadeira.`,
            },
        ],
    });

    return object;
    
    
}
