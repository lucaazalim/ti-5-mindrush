"use server";

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { questionAndAlternativesParser } from '~/lib/parsers';
import { aiGeneratedSchema } from '~/app/dashboard/quizzes/form-schema';
import { z } from 'zod';

export async function generateQuizByTheme(quiz: z.infer<typeof aiGeneratedSchema>){

    const quantityQuestions = 2;
  
    const {object} = await generateObject({
        model: openai('gpt-4.1-nano'),
        maxTokens: 100,
        schema: questionAndAlternativesParser,
        messages: [
            {
                role: 'user',
                content: `Crie um quiz de ${quiz.title} sobre ${quiz.theme} com ${quiz.difficulty} dificuldade em ${quiz.language}, contendo ${quantityQuestions} questoes com 4 alternativas somente uma delas sendo verdadeira.`,
            },

        ],
    })

    return object;
}
