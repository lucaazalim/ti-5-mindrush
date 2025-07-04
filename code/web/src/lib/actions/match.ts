"use server";

import { revalidatePath } from "next/cache";
import {
  checkActiveMatchByQuizId,
  insertMatch,
  selectPopulatedMatchById,
  updateMatch,
} from "~/lib/data/match";
import { fail, Result, succeed } from "~/lib/result";
import { MatchStatus, type Match, type NewMatch, type PopulatedMatch } from "~/lib/types";
import { ROUTES } from "../constants";
import { Uuid } from "../parsers";
import { publishMatchEvent } from "../pusher/publisher";

export async function createMatch(quizId: Uuid): Promise<Result<Match, string>> {
  const existingMatch = await checkActiveMatchByQuizId(quizId);

  if (existingMatch) {
    return fail("Já existe uma partida em andamento para este quiz.");
  }

  const newMatch: NewMatch = {
    quizId: quizId,
    pin: (Math.floor(Math.random() * 900000) + 100000).toString(),
    status: "WAITING",
    createdAt: new Date(),
  };

  const result = await insertMatch(newMatch);

  if (!result) {
    return fail("Falha ao criar a partida.");
  }

  revalidatePath(ROUTES.QUIZZES);

  return succeed(result);
}

export async function getUpdatedMatch(matchId: Uuid): Promise<Result<PopulatedMatch, string>> {
  const match = await selectPopulatedMatchById(matchId);

  if (!match) {
    return fail("A partida não foi encontrada.");
  }

  return succeed(match);
}

export async function startMatch(matchId: Uuid): Promise<Result<PopulatedMatch, string>> {
  const match = await selectPopulatedMatchById(matchId);

  if (!match) {
    return fail("A partida não foi encontrada.");
  }

  if (match.status !== "WAITING") {
    return fail("A partida já foi iniciada.");
  }

  if (match.participants.length < 1) {
    return fail("A partida não pode ser iniada sem nenhum participante.");
  }

  return await updateCurrentQuestion(match, "RUNNING");
}

export async function nextQuestion(matchId: Uuid): Promise<Result<PopulatedMatch, string>> {
  const match = await selectPopulatedMatchById(matchId);

  if (!match) {
    return fail("A partida não foi encontrada.");
  }

  if (match.status !== "RUNNING") {
    return fail("A partida não está em andamento.");
  }

  return await updateCurrentQuestion(match);
}

async function updateCurrentQuestion(
  match: PopulatedMatch,
  newStatus?: MatchStatus,
): Promise<Result<PopulatedMatch, string>> {
  const currentQuestionIndex = match.quiz.questions.findIndex(
    (question) => question.id === match.currentQuestionId,
  );

  const nextQuestion = match.quiz.questions[currentQuestionIndex + 1];

  if (!nextQuestion) {
    return fail("O quiz não possui mais questões.");
  }

  const updatedMatch = await updateMatch(match.id, {
    currentQuestionId: nextQuestion.id,
    currentQuestionStartedAt: new Date(),
    currentQuestionEndsAt: new Date(Date.now() + nextQuestion.timeLimit * 1000),
    ...(newStatus && { status: newStatus }),
  });

  if (!updatedMatch) {
    return fail("Não foi possível avançar para a próxima questão.");
  }

  await publishMatchEvent(match, "next-match-question-event");

  return succeed({
    ...match,
    ...updatedMatch,
    currentQuestion: {
      ...nextQuestion,
      alternatives: nextQuestion.alternatives.map((alternative) => ({
        ...alternative,
        count: 0,
      })),
    },
  });
}

export async function endMatch(matchId: Uuid): Promise<Result<PopulatedMatch, string>> {
  const match = await selectPopulatedMatchById(matchId);

  if (!match) {
    return fail("Partida não encontrada.");
  }

  if (match.status === "ENDED") {
    return fail("Partida já encerrada.");
  }

  const updatedMatch = await updateMatch(match.id, {
    status: "ENDED",
    currentQuestionId: null,
    currentQuestionStartedAt: null,
    currentQuestionEndsAt: null,
    endedAt: new Date(),
  });

  if (!updatedMatch) {
    return fail("Não foi possível atualizar a partida.");
  }

  await publishMatchEvent(match, "match-ended-event");

  revalidatePath(ROUTES.QUIZZES);

  return succeed({ ...match, ...updatedMatch });
}
