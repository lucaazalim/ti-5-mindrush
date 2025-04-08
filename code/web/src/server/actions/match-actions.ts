"use server";

import {db} from "~/server/db";
import {matches} from "~/server/db/schema";
import {matchIdOrPinParser, uuidParser} from "~/lib/parsers";
import {eq} from "drizzle-orm";
import type {Match} from "~/lib/types";
import {Result} from "~/lib/result";

export async function getMatchByIdOrPin(idOrPin: string): Promise<Result<Match, {message: string, status: number}>> {

    const parsedIdOrPin = matchIdOrPinParser.safeParse(idOrPin);

    if (parsedIdOrPin.error) {
        return Result.fail({
            message: "Invalid match ID or PIN.",
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
        return Result.fail({
            message: "Match not found.",
            status: 404,
        });
    }

    return Result.succeed(match);

}