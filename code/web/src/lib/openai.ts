import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { pdfGeneratedSchema, themeGeneratedSchema } from "~/app/dashboard/quizzes/form-schema";
import { questionWithAlternativesParser } from "./parsers";

const questionsCount = 5;

const questionAndAlternativesSchema = z.object({
  questions: z.array(
    questionWithAlternativesParser.omit({
      id: true,
      image: true,
    }),
  ),
});

/**
 * Generates a quiz based on a given theme.
 *
 * @param quiz The quiz object containing the theme, difficulty, and language.
 * @returns A promise that resolves to the generated quiz object.
 */
export async function generateQuizByTheme(quiz: z.infer<typeof themeGeneratedSchema>) {
  const { object } = await generateObject({
    model: openai("gpt-4.1-nano"),
    maxTokens: 500,
    schema: questionAndAlternativesSchema,
    messages: [
      {
        role: "user",
        content: `Crie um quiz sobre ${quiz.title} com dificuldade ${quiz.difficulty} em ${quiz.language}, contendo ${questionsCount} questões com 4 alternativas, sendo somente uma delas verdadeira.`,
      },
    ],
  });

  return object;
}

/**
 * Generates a quiz based on the text extracted from a PDF.
 *
 * @param quiz The quiz object containing the extracted text, difficulty, and language.
 * @returns A promise that resolves to the generated quiz object.
 */
export async function generateQuizByPDF(quiz: z.infer<typeof pdfGeneratedSchema>) {
  const extractedText = quiz.pdfText ?? "";

  const { object } = await generateObject({
    model: openai("gpt-4.1-nano"),
    maxTokens: 500,
    schema: questionAndAlternativesSchema,
    messages: [
      {
        role: "user",
        content: `Baseado no seguinte conteúdo extraído de um PDF, crie um quiz com ${questionsCount} questões de múltipla escolha, em ${quiz.language}, com dificuldade ${quiz.difficulty}, cada uma com 4 alternativas, sendo apenas uma correta:\n\n"${extractedText}"`,
      },
    ],
  });

  return object;
}
