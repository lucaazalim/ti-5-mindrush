import { and, eq } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import { quizAnswers } from "~/lib/db/schema";
import { DataAccessOptions, NewQuizAnswer, QuizAnswer } from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { Uuid } from "../parsers";
import { incrementParticipantPoints } from "./participant";
import { selectQuizByMatchId } from "./quiz";

export async function insertQuizAnswer(quizAnswer: NewQuizAnswer) {
  await db.transaction(async (transaction) => {
    await transaction.insert(quizAnswers).values(quizAnswer);
    await incrementParticipantPoints(transaction, quizAnswer.participantId, quizAnswer.points);
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
  { internal = false }: DataAccessOptions = {},
): Promise<QuizAnswer[]> {
  const session = await auth();

  if (!internal && !session) {
    return unauthorized();
  }

  const quiz = await selectQuizByMatchId(matchId, {internal});

  if (session && !internal && (!quiz || quiz.educatorId !== session.user.id)) {
    return unauthorized();
  }

  return await db
    .select()
    .from(quizAnswers)
    .where(and(eq(quizAnswers.matchId, matchId), eq(quizAnswers.questionId, questionId)));
}
