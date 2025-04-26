import { and, eq, sql } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import { NewQuizAnswer, QuizAnswer, Uuid } from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { participants, quizAnswers } from "../db/schema";
import { selectQuizByMatchId } from "./quiz";

export async function insertQuizAnswer(quizAnswer: NewQuizAnswer) {
  await db.transaction(async (transaction) => {
    await transaction.insert(quizAnswers).values(quizAnswer);
    await transaction
      .update(participants)
      .set({ totalPoints: sql`${participants.totalPoints} + ${quizAnswer.points}` })
      .where(eq(participants.id, quizAnswer.participantId));
  });
}

export async function selectQuizAnswer(
  participantId: Uuid,
  questionId: Uuid,
): Promise<QuizAnswer | undefined> {
  return (
    await db
      .select()
      .from(quizAnswers)
      .where(
        and(eq(quizAnswers.questionId, questionId), eq(quizAnswers.participantId, participantId)),
      )
  )[0];
}

export async function selectQuizAnswersByQuestionId(
  matchId: Uuid,
  questionId: Uuid,
): Promise<QuizAnswer[]> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const quiz = await selectQuizByMatchId(matchId);

  if (!quiz || quiz.educatorId !== session.user.id) {
    return unauthorized();
  }

  return await db
    .select()
    .from(quizAnswers)
    .where(and(eq(quizAnswers.matchId, matchId), eq(quizAnswers.questionId, questionId)));
}
