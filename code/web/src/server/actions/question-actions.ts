"use server";

import { z } from "zod";
import { db } from "~/server/db";
import { quizQuestionsAlternatives } from "~/server/db/schema";
import { uuidParser } from "~/lib/parsers";

const questionSchema = z.object({
  quizId: uuidParser,
  questions: z.array(
    z.object({
      text: z.string().min(1, "A pergunta não pode estar vazia"),
      answers: z.array(z.string().min(1)).min(2).max(4),
      correctAnswerIndex: z.number().min(0),
      type: z.enum(["QUIZ", "VERDADEIRO_FALSO"]),
    }),
  ),
});

export async function saveQuestionsAndAnswers(data: unknown) {
  const parsed = questionSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Dados inválidos para salvar perguntas.");
  }

  const { quizId, questions } = parsed.data;

  try {
    for (const q of questions) {
      const questionId = crypto.randomUUID();
      const mappedType =
        q.type === "VERDADEIRO_FALSO" ? "TRUE_OR_FALSE" : q.type;

      await db.insert(questions).values({
        id: questionId,
        quizId,
        question: q.text,
        type: mappedType,
        timeLimit: 20,
      });

      const alternatives = q.answers.map((answer, index) => ({
        id: crypto.randomUUID(),
        questionId,
        answer,
        correct: index === q.correctAnswerIndex,
      }));

      await db.insert(quizQuestionsAlternatives).values(alternatives);
    }
  } catch (error) {
    throw new Error("Erro interno ao salvar perguntas.");
  }
}
