import { and, count, eq, getTableColumns, inArray } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import {
  NewQuiz,
  Quiz,
  QuizWithQuestionCountAndActiveMatch,
  Uuid,
  type QuizWithQuestionsAndAlternatives,
} from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { matches, questionAlternatives, questions, quizzes } from "~/lib/db/schema";

export async function insertQuiz(newQuiz: Omit<NewQuiz, "educatorId">): Promise<Quiz> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const [createdQuiz] = await db
    .insert(quizzes)
    .values({ ...newQuiz, educatorId: session.user.id as Uuid })
    .returning();

  if (!createdQuiz) {
    throw new Error("Failed to create quiz.");
  }

  return createdQuiz;
}

export async function selectQuizByMatchId(matchId: Uuid): Promise<Quiz | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const result = await db
    .select({
      quiz: quizzes,
    })
    .from(quizzes)
    .innerJoin(matches, eq(matches.quizId, quizzes.id))
    .where(and(eq(matches.id, matchId), eq(quizzes.educatorId, session.user.id as Uuid)));

  return result[0]?.quiz;
}

export async function selectQuizById(quizId: Uuid): Promise<Quiz | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  return (
    await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.educatorId, session.user.id as Uuid)))
  )[0];
}

export async function selectAllQuizzesWithQuestionCountAndActiveMatch(): Promise<
  QuizWithQuestionCountAndActiveMatch[]
> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const quizzesWithExtras: QuizWithQuestionCountAndActiveMatch[] = await db
    .select({
      ...getTableColumns(quizzes),
      questionCount: count(),
      activeMatch: getTableColumns(matches),
    })
    .from(quizzes)
    .leftJoin(questions, eq(questions.quizId, quizzes.id))
    .leftJoin(
      matches,
      and(eq(matches.quizId, quizzes.id), inArray(matches.status, ["WAITING", "RUNNING"])),
    )
    .where(eq(quizzes.educatorId, session.user.id as Uuid))
    .groupBy(quizzes.id, matches.id);

  return quizzesWithExtras;
}

export async function selectQuizWithQuestionsAndAlternatives(
  quizId: Uuid,
): Promise<QuizWithQuestionsAndAlternatives | undefined> {
  const quiz = await selectQuizById(quizId);

  if (!quiz) {
    return undefined;
  }

  const questionsResult = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(questions.order);

  const alternativesResult = await db
    .select()
    .from(questionAlternatives)
    .where(
      inArray(
        questionAlternatives.questionId,
        questionsResult.map((quiz) => quiz.id),
      ),
    );

  const questionsWithAlternatives = questionsResult.map((question) => ({
    ...question,
    alternatives: alternativesResult.filter(
      (alternative) => alternative.questionId === question.id,
    ),
  }));

  return {
    ...quiz,
    questions: questionsWithAlternatives,
  };
}

export async function updateQuiz(
  quizId: Uuid,
  updatedQuiz: Partial<Quiz>,
): Promise<Quiz | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const [updated] = await db
    .update(quizzes)
    .set(updatedQuiz)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.educatorId, session.user.id as Uuid)))
    .returning();

  return updated;
}

export async function deleteQuiz(quizId: Uuid): Promise<boolean> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const result = await db
    .delete(quizzes)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.educatorId, session.user.id as Uuid)));

  return result.count > 0;
}
