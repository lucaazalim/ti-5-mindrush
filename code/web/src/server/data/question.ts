import { and, eq } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import {
  DataAccessOptions,
  NewQuestionAlternative,
  QuestionWithAlternatives,
  RawQuestionsWithAlternatives,
  Uuid,
} from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { questionAlternatives, questions, quizzes } from "../db/schema";

export async function insertQuestionsAndAlternatives(
  quizId: Uuid,
  data: RawQuestionsWithAlternatives,
): Promise<void> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const existingOrders = await db
    .select({ order: questions.order })
    .from(questions)
    .where(eq(questions.quizId, quizId));

  let nextOrder = existingOrders.length
    ? Math.max(...existingOrders.map((q) => q.order ?? 0)) + 1
    : 0;

  for (const parsedQuestion of data.questions) {
    const createdQuestion = (
      await db
        .insert(questions)
        .values({
          quizId,
          question: parsedQuestion.question,
          type: parsedQuestion.type,
          timeLimit: 20,
          image: parsedQuestion.image ?? null,
          order: nextOrder++,
        })
        .returning()
    )[0];

    if (!createdQuestion) continue;

    const alternatives: NewQuestionAlternative[] = parsedQuestion.alternatives.map(
      (answer, index) => ({
        questionId: createdQuestion.id,
        answer,
        isCorrect: index === parsedQuestion.correctAlternativeIndex,
        order: index,
      }),
    );

    await db.insert(questionAlternatives).values(alternatives);
  }
}

export async function selectQuestionWithAlternatives(
  questionId: Uuid,
  { internal = false }: DataAccessOptions = {},
): Promise<QuestionWithAlternatives | undefined> {
  const session = await auth();

  if (!internal && !session) {
    return unauthorized();
  }

  const questionWithQuiz = (
    await db
      .select()
      .from(questions)
      .innerJoin(quizzes, eq(questions.quizId, quizzes.id))
      .where(
        internal
          ? eq(questions.id, questionId)
          : and(eq(questions.id, questionId), eq(quizzes.educatorId, session!.user.id as Uuid)),
      )
      .orderBy(questions.order)
  )[0];

  if (!questionWithQuiz) {
    return undefined;
  }

  const { question } = questionWithQuiz;

  const alternatives = await db
    .select()
    .from(questionAlternatives)
    .where(eq(questionAlternatives.questionId, questionId))
    .orderBy(questionAlternatives.order);

  return {
    ...question,
    alternatives,
  };
}
