import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { matchIdOrPinParser, uuidParser } from "~/lib/parsers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ idOrPin: string }> },
) {
  const { idOrPin } = await params;
  const parsedIdOrPin = matchIdOrPinParser.safeParse(idOrPin);

  if (parsedIdOrPin.error) {
    return NextResponse.json("Invalid ID or PIN.", {
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
    return NextResponse.json("Match not found.", { status: 404 });
  }

  return NextResponse.json(match, { status: 200 });
}
