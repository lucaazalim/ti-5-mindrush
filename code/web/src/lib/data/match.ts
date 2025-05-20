import { and, desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { forbidden, unauthorized } from "next/navigation";
import { matches, participants, questionAlternatives, questions, quizzes } from "~/lib/db/schema";
import {
  DataAccessOptions,
  MatchWithQuizTitle,
  NewMatch,
  type Match,
  type PopulatedMatch,
} from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { Uuid, isUuid } from "../parsers";
import { selectQuizAnswersByQuestionId } from "./answer";
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
      .select()
      .from(matches)
      .where(isUuid(idOrPin) ? eq(matches.id, idOrPin) : eq(matches.pin, idOrPin))
  )[0];
}

export async function selectAllMatches(): Promise<MatchWithQuizTitle[]> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const matchesWhithQuizTitle: MatchWithQuizTitle[] = await db
    .select({
      ...getTableColumns(matches),
      quizTitle: getTableColumns(quizzes).title,
    })
    .from(matches)
    .innerJoin(quizzes, eq(matches.quizId, quizzes.id))
    .where(eq(quizzes.educatorId, session.user.id as Uuid))
    .orderBy(desc(matches.createdAt));

  return matchesWhithQuizTitle;
}

export async function selectPopulatedMatchById(
  matchId: Uuid,
  { internal = false }: DataAccessOptions = {},
): Promise<PopulatedMatch | undefined> {
  const session = await auth();

  if (!internal && !session) {
    return unauthorized();
  }

  const matchWithQuiz = (
    await db
      .select()
      .from(matches)
      .innerJoin(quizzes, eq(matches.quizId, quizzes.id))
      .where(
        session
          ? and(eq(matches.id, matchId), eq(quizzes.educatorId, session.user.id as Uuid))
          : eq(matches.id, matchId),
      )
  )[0];

  if (!matchWithQuiz) {
    return undefined;
  }

  const { quiz, match } = matchWithQuiz;

  const questionsResult = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quiz.id))
    .orderBy(questions.order);

  const alternativesResult = await db
    .select()
    .from(questionAlternatives)
    .where(
      inArray(
        questionAlternatives.questionId,
        questionsResult.map((q) => q.id),
      ),
    )
    .orderBy(questionAlternatives.order);

  let currentQuestionWithAlternativesAndCount = null;

  if (match.currentQuestionId) {
    const currentQuestion = questionsResult.find(
      (question) => question.id === match.currentQuestionId,
    );

    if (!currentQuestion) {
      return undefined;
    }

    const currentQuestionAnswers = await selectQuizAnswersByQuestionId(
      match.id,
      currentQuestion.id,
    );

    const currentQuestionAlternatives = alternativesResult
      .filter((alternative) => alternative.questionId === match.currentQuestionId)
      .map((alternative) => ({
        ...alternative,
        count: currentQuestionAnswers.filter((answer) => answer.alternativeId === alternative.id)
          .length,
      }));

    currentQuestionWithAlternativesAndCount = {
      ...currentQuestion,
      alternatives: currentQuestionAlternatives,
    };
  }

  const participantsResult = await db
    .select()
    .from(participants)
    .where(eq(participants.matchId, matchWithQuiz.match.id))
    .orderBy(desc(participants.totalPoints));

  return {
    ...matchWithQuiz.match,
    currentQuestion: currentQuestionWithAlternativesAndCount,
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
}

export async function checkActiveMatchByQuizId(quizId: Uuid): Promise<Match | undefined> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const [match] = await db
    .select()
    .from(matches)
    .where(and(eq(matches.quizId, quizId), inArray(matches.status, ["WAITING", "RUNNING"])));

  return match;
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
