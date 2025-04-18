"use server";

import { db } from "~/server/db";
import {
  matches,
  participants,
  questions,
  quizQuestionsAlternatives,
  quizzes,
} from "~/server/db/schema";
import { matchIdOrPinParser, uuidParser } from "~/lib/parsers";
import { eq, inArray } from "drizzle-orm";
import { type Match, type NewMatch, type PopulatedMatch, type SimpleError } from "~/lib/types";
import { isMatchPin, isUuid, MatchPin, Uuid } from "~/lib/branded-types";
import { fail, isFailure, Result, succeed } from "~/lib/result";
import { auth } from "~/server/auth";

export async function getMatchByIdOrPin(
  idOrPin: MatchPin | Uuid,
): Promise<Result<Match, SimpleError>> {
  const result = await db
    .select()
    .from(matches)
    .where(isUuid(idOrPin) ? eq(matches.id, idOrPin) : eq(matches.pin, idOrPin));

  const match = result[0];

  if (!match) {
    return fail({
      message: "Partida não encontrada.",
      status: 404,
    });
  }

  return succeed(match);
}

export async function getPopulatedMatchById(
  id: Uuid,
): Promise<Result<PopulatedMatch, SimpleError>> {
  const matchWithQuizResult = await db
    .select()
    .from(matches)
    .innerJoin(quizzes, eq(matches.quizId, quizzes.id))
    .where(eq(matches.id, id));

  const matchWithQuiz = matchWithQuizResult[0];

  if (!matchWithQuiz) {
    return fail({
      message: "Partida não encontrada.",
      status: 404,
    });
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

  return succeed(populatedMatch);
}

export async function createMatch(quizId: Uuid): Promise<Result<Match, string>> {
  const session = await auth();

  if (!session) {
    return fail("Não autenticado.");
  }

  const newMatch: NewMatch = {
    quizId: quizId,
    pin: (Math.floor(Math.random() * 900000) + 100000).toString(),
    state: "WAITING",
    createdAt: new Date(),
  };

  const result = await db.insert(matches).values(newMatch).returning();

  if (result.length > 0) {
    return succeed(result[0]);
  }

  return fail("Ocorreu um erro ao criar a partida.");
}

export async function startMatch(matchId: Uuid): Promise<Result<PopulatedMatch, string>> {
  const session = await auth();

  if (!session) {
    return fail("Não autenticado.");
  }

  const matchResult = await getPopulatedMatchById(matchId);

  if (isFailure(matchResult)) {
    return fail(matchResult.error.message);
  }

  const match = matchResult.data;

  // TODO make sure the user is the owner of the match

  if (match.state !== "WAITING") {
    return fail("Partida já iniciada.");
  }

  const firstQuestion = match.quiz.questions[0];

  if (!firstQuestion) {
    return fail("O quiz não possui questões.");
  }

  const updateResult = await db
    .update(matches)
    .set({ state: "RUNNING", currentQuestionId: firstQuestion.id })
    .where(eq(matches.id, match.id))
    .returning();

  const updatedMatch = updateResult[0];

  if (!updatedMatch) {
    return fail("Não foi possível atualizar a partida.");
  }

  return succeed({ updatedMatch, ...match });
}
