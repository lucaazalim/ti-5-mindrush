"use server";

import { z } from "zod";
import { db } from "~/server/db";
import { question, questionQuizAlternatives } from "~/server/db/schema";
import { nanoid } from "nanoid";
import { eq, inArray } from "drizzle-orm";

const questionSchema = z.object({
  quizId: z.string().uuid(),
  questions: z.array(
    z.object({
      text: z.string().min(1, "A pergunta não pode estar vazia"),
      answers: z.array(z.string().min(1)).min(2).max(4),
      correctAnswerIndex: z.number().min(0),
      type: z.enum(["QUIZ", "VERDADEIRO_FALSO"]),
    })
  ),
});

export async function saveQuestionsAndAnswers(data: unknown) {
  const parsed = questionSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Dados inválidos");
  }

  const { quizId, questions } = parsed.data;

  try {
    const existingQuestions = await db
      .select({ id: question.id })
      .from(question)
      .where(eq(question.quizId, quizId));

    const questionIds = existingQuestions.map((q) => q.id);

    if (questionIds.length > 0) {
      await db
        .delete(questionQuizAlternatives)
        .where(inArray(questionQuizAlternatives.questionId, questionIds));
    }

    await db.delete(question).where(eq(question.quizId, quizId));

    for (const q of questions) {
      const questionId = nanoid();

      await db.insert(question).values({
        id: questionId,
        quizId,
        question: q.text,
        type: q.type === "VERDADEIRO_FALSO" ? "TRUE_OR_FALSE" : q.type,
        timeLimit: 20,
      });

      const alternatives = q.answers.map((answer, index) => ({
        id: nanoid(),
        questionId,
        answer,
        correct: index === q.correctAnswerIndex,
      }));

      await db.insert(questionQuizAlternatives).values(alternatives);
    }

  } catch (err) {
    throw new Error("Erro ao salvar perguntas.");
  }
}
