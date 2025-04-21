import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import { forbidden, unauthorized } from "next/navigation";
import { NewMatch, Uuid, isUuid, type Match, type PopulatedMatch } from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { matches, participants, questionAlternatives, questions, quizzes } from "../db/schema";
import { selectQuizById, selectQuizByMatchId } from "./quiz";

export async function insertMatch(match: NewMatch): Promise<Match | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const quiz = await selectQuizById(match.quizId);

  if (!quiz) {
    return undefined;
  }

  if (quiz.educatorId !== session.user.id) {
    return forbidden();
  }

  return (await db.insert(matches).values(match).returning())[0];
}

export async function selectMatchByIdOrPin(idOrPin: string): Promise<Match | undefined> {
  return (
    await db
      .select(getTableColumns(matches))
      .from(matches)
      .innerJoin(quizzes, eq(matches.quizId, quizzes.id))
      .where(isUuid(idOrPin) ? eq(matches.id, idOrPin) : eq(matches.pin, idOrPin))
  )[0];
}

export async function selectPopulatedMatchById(matchId: Uuid): Promise<PopulatedMatch | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const matchWithQuizResult = await db
    .select()
    .from(matches)
    .innerJoin(quizzes, eq(matches.quizId, quizzes.id))
    .where(and(eq(matches.id, matchId), eq(quizzes.educatorId, session.user.id as Uuid)));

  const matchWithQuiz = matchWithQuizResult[0];

  if (!matchWithQuiz) {
    return undefined;
  }

  const questionsResult = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, matchWithQuiz.quiz.id))
    .orderBy(questions.order);

  const alternativesResult = await db
    .select()
    .from(questionAlternatives)
    .where(
      inArray(
        questionAlternatives.questionId,
        questionsResult.map((q) => q.id),
      ),
    );

  const participantsResult = await db
    .select()
    .from(participants)
    .where(eq(participants.matchId, matchWithQuiz.match.id));

  const populatedMatch = {
    ...matchWithQuiz.match,
    quiz: {
      ...matchWithQuiz.quiz,
      questions: questionsResult.map((question) => ({
        ...question,
        alternatives: alternativesResult.filter(
          (alternative) => alternative.questionId === question.id,
        ),
      })),
    },
    participants: participantsResult,
  };

  return populatedMatch;
}

export async function updateMatch(
  matchId: Uuid,
  updates: Partial<Match>,
): Promise<Match | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const quiz = await selectQuizByMatchId(matchId);

  if (!quiz) {
    return undefined;
  }

  if (quiz.educatorId !== session.user.id) {
    return forbidden();
  }

  return (await db.update(matches).set(updates).where(eq(matches.id, matchId)).returning())[0];
}
