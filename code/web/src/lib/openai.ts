import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { themeGeneratedSchema, pdfGeneratedSchema } from "~/app/dashboard/quizzes/form-schema";
import { QUESTION_TYPES } from "./constants";

const questionAndAlternativesSchema = z.object({
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

/**
 * Generates a quiz based on a given theme.
 *
 * @param quiz The quiz object containing the theme, difficulty, and language.
 * @returns A promise that resolves to the generated quiz object.
 */
export async function generateQuizByTheme(quiz: z.infer<typeof themeGeneratedSchema>) {
  const quantityQuestions = 2;

  const { object } = await generateObject({
    model: openai("gpt-4.1-nano"),
    maxTokens: 500,
    schema: questionAndAlternativesSchema,
    messages: [
      {
        role: "user",
        content: `Crie um quiz sobre ${quiz.title} com dificuldade ${quiz.difficulty} em ${quiz.language}, contendo ${quantityQuestions} questões com 4 alternativas, sendo somente uma delas verdadeira.`,
      },
    ],
  });

  return object;
}

export async function generateQuizByPDF(quiz: z.infer<typeof pdfGeneratedSchema>) {
  const quantityQuestions = 3;

  try {
    const extractedText = quiz.pdfText ?? "";

    const { object } = await generateObject({
      model: openai("gpt-4.1-nano"),
      maxTokens: 500,
      schema: questionAndAlternativesSchema,
      messages: [
        {
          role: "user",
          content: `Baseado no seguinte conteúdo extraído de um PDF, crie um quiz com ${quantityQuestions} questões de múltipla escolha, em ${quiz.language}, com dificuldade ${quiz.difficulty}, cada uma com 4 alternativas, sendo apenas uma correta:\n\n"${extractedText}"`,
        },
      ],
    });

    return object;

  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error(String(e));
    }
  }
}
