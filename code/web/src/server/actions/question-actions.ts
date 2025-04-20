"use server";

import { z } from "zod";
import { QUESTION_TYPES } from "~/lib/constants";
import { uuidParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { NewQuestionAlternative } from "~/lib/types";
import { db } from "~/server/db";
import { questionAlternatives, questions } from "~/server/db/schema";

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

export async function saveQuestionsAndAlternatives(
  data: z.infer<typeof questionSchema>,
): Promise<Result<void, string>> {
  const parsed = questionSchema.safeParse(data);

  if (!parsed.success) {
    return fail("Os dados de questões e alternativas informados são inválidos.");
  }

  const { quizId, questions: parsedQuestions } = parsed.data;

  for (const parsedQuestion of parsedQuestions) {
    const createdQuestion = (
      await db
        .insert(questions)
        .values({
          quizId,
          question: parsedQuestion.text,
          type: parsedQuestion.type,
          timeLimit: 20,
        })
        .returning()
    )[0];

    if (!createdQuestion) continue;

    const alternatives: NewQuestionAlternative[] = parsedQuestion.answers.map((answer, index) => ({
      questionId: createdQuestion.id,
      answer,
      correct: index === parsedQuestion.correctAnswerIndex,
    }));

    await db.insert(questionAlternatives).values(alternatives);
  }

  return succeed();
}
