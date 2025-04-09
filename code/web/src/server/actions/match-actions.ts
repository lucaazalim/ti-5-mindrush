"use server";

import {db} from "~/server/db";
import {matches} from "~/server/db/schema";
import {matchIdOrPinParser, uuidParser} from "~/lib/parsers";
import {eq} from "drizzle-orm";
import type {Match, NewMatch} from "~/lib/types";
import {fail, Result, succeed} from "~/lib/result";

export async function getMatchByIdOrPin(idOrPin: string): Promise<Result<Match, {message: string, status: number}>> {

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

    if(!match) {
        return fail({
            message: "Partida não encontrada.",
            status: 404,
        });
    }

    return succeed(match);

}

export async function createMatch(quizId: string): Promise<Result<Match, {message: string, status: number}>> {
    const newMatch: NewMatch = {
        quizId: quizId,
        pin: generateRandomPin(),
        state: "WAITING",
        createdAt: new Date(),
    };

    const result = await db
        .insert(matches)
        .values(newMatch)
        .returning();

    if (result.length > 0) {
        return succeed(result[0]!);
    }

    return fail({
        message: "Ocorreu um erro ao criar a partida.",
        status: 500,
    });

}

function generateRandomPin(): string {
    const pin = Math.floor(Math.random() * 1000000).toString();
    return pin.substring(pin.length - 6);
}