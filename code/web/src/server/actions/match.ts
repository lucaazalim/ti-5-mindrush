"use server";

import { fail, Result, succeed } from "~/lib/result";
import { MatchStatus, Uuid, type Match, type NewMatch, type PopulatedMatch } from "~/lib/types";
import { auth } from "~/server/auth";
import {
  insertMatch,
  selectMatchByIdOrPin,
  selectPopulatedMatchById,
  updateMatch,
} from "../data/match";
import { callMatchEvent, MatchEndedEvent, NextMatchQuestionEvent } from "../event-publisher";

export async function createMatch(quizId: Uuid): Promise<Result<Match, string>> {
  const session = await auth();

  if (!session) {
    return fail("Não autenticado.");
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

  return succeed(result);
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

async function updateCurrentQuestion(match: PopulatedMatch, newStatus?: MatchStatus) {
  const currentQuestionIndex = match.quiz.questions.findIndex(
    (question) => question.id === match.currentQuestionId,
  );

  const nextQuestion = match.quiz.questions[currentQuestionIndex + 1];

  if (!nextQuestion) {
    return fail("O quiz não possui mais questões.");
  }

  const updatedMatch = await updateMatch(match.id, {
    currentQuestionId: nextQuestion.id,
    currentQuestionEndsAt: new Date(Date.now() + nextQuestion.timeLimit * 1000),
    ...(newStatus && { status: newStatus }),
  });

  if (!updatedMatch) {
    return fail("Não foi possível avançar para a próxima questão.");
  }

  await callMatchEvent(new NextMatchQuestionEvent(match.id));

  return succeed({ ...match, ...updatedMatch, currentQuestion: nextQuestion });
}

export async function endMatch(matchId: Uuid): Promise<Result<Match, string>> {
  const match = await selectMatchByIdOrPin(matchId);

  if (!match) {
    return fail("Partida não encontrada.");
  }

  if (match.status === "ENDED") {
    return fail("Partida já encerrada.");
  }

  const updatedMatch = await updateMatch(match.id, {
    status: "ENDED",
  });

  if (!updatedMatch) {
    return fail("Não foi possível atualizar a partida.");
  }

  await callMatchEvent(new MatchEndedEvent(match.id));

  return succeed(updatedMatch);
}
