"use server";

import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { matchIdOrPinParser, uuidParser } from "~/lib/parsers";
import { eq } from "drizzle-orm";
import type { Match, NewMatch } from "~/lib/types";
import { fail, isFailure, Result, succeed } from "~/lib/result";
import { auth } from "~/server/auth";

export async function getMatchByIdOrPin(
  idOrPin: string,
): Promise<Result<Match, { message: string; status: number }>> {
  const parsedIdOrPin = matchIdOrPinParser.safeParse(idOrPin);

  if (parsedIdOrPin.error) {
    return fail({
      message: "O ID ou PIN da partida informado é inválido.",
      status: 400,
    });
  }

  const result = await db
    .select()
    .from(matches)
    .where(
      uuidParser.safeParse(idOrPin).success
        ? eq(matches.id, parsedIdOrPin.data)
        : eq(matches.pin, parsedIdOrPin.data),
    );

  const match = result[0];

  if (!match) {
    return fail({
      message: "Partida não encontrada.",
      status: 404,
    });
  }

  return succeed(match);
}

export async function createMatch(
  quizId: string,
): Promise<Result<Match, string>> {
  const session = await auth();

  if (!session) {
    return fail("Não autenticado.");
  }

  const newMatch: NewMatch = {
    quizId: quizId,
    pin: generateRandomPin(),
    state: "WAITING",
    createdAt: new Date(),
  };

  const result = await db.insert(matches).values(newMatch).returning();

  if (result.length > 0) {
    return succeed(result[0]!);
  }

  return fail("Ocorreu um erro ao criar a partida.");
}

function generateRandomPin(): string {
  return (Math.floor(Math.random() * 900000) + 100000).toString();
}

export async function startMatch(
  matchId: string,
): Promise<Result<Match, string>> {
  const session = await auth();

  if (!session) {
    return fail("Não autenticado.");
  }

  const matchResult = await getMatchByIdOrPin(matchId);

  if (isFailure(matchResult)) {
    return fail(matchResult.error.message);
  }

  const match = matchResult.data;

  if (match.state !== "WAITING") {
    return fail("Partida já iniciada.");
  }

  const updateResult = await db
    .update(matches)
    .set({ state: "RUNNING" })
    .where(eq(matches.id, match.id))
    .returning();

  const updatedMatch = updateResult[0];

  if (!updatedMatch) {
    return fail("Não foi possível atualizar a partida.");
  }

  return succeed(updatedMatch);
}
