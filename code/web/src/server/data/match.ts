import { eq, inArray } from "drizzle-orm";
import { NewMatch, Uuid, isUuid, type Match, type PopulatedMatch } from "~/lib/types";
import { db } from "../db";
import { matches, participants, questions, quizQuestionsAlternatives, quizzes } from "../db/schema";

export async function insertMatch(match: NewMatch): Promise<Match | undefined> {
  return (await db.insert(matches).values(match).returning())[0];
}

export async function selectMatchByIdOrPin(idOrPin: string): Promise<Match | undefined> {
  return (
    await db
      .select()
      .from(matches)
      .where(isUuid(idOrPin) ? eq(matches.id, idOrPin) : eq(matches.pin, idOrPin))
  )[0];
}

export async function selectPopulatedMatchById(id: Uuid): Promise<PopulatedMatch | undefined> {
  const matchWithQuizResult = await db
    .select()
    .from(matches)
    .innerJoin(quizzes, eq(matches.quizId, quizzes.id))
    .where(eq(matches.id, id));

  const matchWithQuiz = matchWithQuizResult[0];

  if (!matchWithQuiz) {
    return undefined;
  }

  const questionsResult = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, matchWithQuiz.quiz.id));

  const alternativesResult = await db
    .select()
    .from(quizQuestionsAlternatives)
    .where(
      inArray(
        quizQuestionsAlternatives.questionId,
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

export async function updateMatch(id: Uuid, updates: Partial<Match>): Promise<Match | undefined> {
  return (await db.update(matches).set(updates).where(eq(matches.id, id)).returning())[0];
}
