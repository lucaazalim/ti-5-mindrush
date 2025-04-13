"use server";

import { z } from "zod";
import { db } from "~/server/db";
import { questions, quizQuestionsAlternatives } from "~/server/db/schema";
import { uuidParser } from "~/lib/parsers";
import { QUESTION_TYPES } from "~/lib/constants";

const questionSchema = z.object({
  quizId: uuidParser,
  questions: z.array(
    z.object({
      text: z.string().min(1, "A pergunta não pode estar vazia"),
      answers: z.array(z.string().min(1)).min(2).max(4),
      correctAnswerIndex: z.number().min(0),
      type: z.enum(QUESTION_TYPES),
    }),
  ),
});

export async function saveQuestionsAndAnswers(
  data: z.infer<typeof questionSchema>,
) {
  const parsed = questionSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Dados inválidos para salvar perguntas.");
  }

  const { quizId, questions: parsedQuestions } = parsed.data;

  try {
    for (const parsedQuestion of parsedQuestions) {
      const questionId = crypto.randomUUID();

      await db.insert(questions).values({
        id: questionId,
        quizId,
        question: parsedQuestion.text,
        type: parsedQuestion.type,
        timeLimit: 20,
      });

      const alternatives = parsedQuestion.answers.map((answer, index) => ({
        id: crypto.randomUUID(),
        questionId,
        answer,
        correct: index === parsedQuestion.correctAnswerIndex,
      }));

      await db.insert(quizQuestionsAlternatives).values(alternatives);
    }
  } catch {
    throw new Error("Erro interno ao salvar perguntas.");
  }
}
