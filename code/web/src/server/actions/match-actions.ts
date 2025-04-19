"use server";

import { fail, Result, succeed } from "~/lib/result";
import { Uuid, type Match, type NewMatch, type PopulatedMatch } from "~/lib/types";
import { auth } from "~/server/auth";
import { insertMatch, selectPopulatedMatchById, updateMatch } from "../data/match";

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

  const result = await insertMatch(newMatch);

  if (!result) {
    return fail("Falha ao criar a partida.");
  }

  return succeed(result);
}

export async function startMatch(matchId: Uuid): Promise<Result<PopulatedMatch, string>> {
  const match = await selectPopulatedMatchById(matchId);

  if (!match) {
    return fail("Partida não encontrada.");
  }

  if (match.state !== "WAITING") {
    return fail("Partida já iniciada.");
  }

  const firstQuestion = match.quiz.questions[0];

  if (!firstQuestion) {
    return fail("O quiz não possui questões.");
  }

  const updatedMatch = await updateMatch(match.id, {
    state: "RUNNING",
    currentQuestionId: firstQuestion.id,
  });

  if (!updatedMatch) {
    return fail("Não foi possível atualizar a partida.");
  }

  return succeed({ updatedMatch, ...match });
}
