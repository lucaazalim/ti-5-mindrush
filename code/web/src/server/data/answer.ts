import { and, eq } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import { NewQuizAnswer, QuizAnswer, Uuid } from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { quizAnswers } from "../db/schema";
import { selectPopulatedMatchById } from "./match";
import { DataAccessOptions } from "./types";

export async function insertQuizAnswer(
  quizAnswer: NewQuizAnswer,
  { internal = false }: DataAccessOptions = {},
) {
  const session = await auth();

  if (!internal) {
    if (!session) {
      return unauthorized();
    }

    const match = await selectPopulatedMatchById(quizAnswer.matchId);

    if (!match || match.quiz.educatorId !== session.user.id) {
      return unauthorized();
    }
  }

  await db.insert(quizAnswers).values(quizAnswer);
}

export async function selectQuizAnswer(
  participantId: Uuid,
  questionId: Uuid,
  { internal = false }: DataAccessOptions = {},
): Promise<QuizAnswer | undefined> {
  const session = await auth();

  if (!internal && !session) {
    return unauthorized();
  }

  return (
    await db
      .select()
      .from(quizAnswers)
      .where(
        and(eq(quizAnswers.questionId, questionId), eq(quizAnswers.participantId, participantId)),
      )
  )[0];
}
