import { type NextRequest, NextResponse } from "next/server";
import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import { participantCreationParser } from "~/lib/parsers";
import { z } from "zod";
import { db } from "~/server/db";
import { participants } from "~/server/db/schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ idOrPin: string }> },
) {
  const { idOrPin } = await params;
  const match = await getMatchByIdOrPin(idOrPin);

  if (match.error) {
    return NextResponse.json(match.error.message, {
      status: match.error.status,
    });
  }

  const payload = (await req.json()) as z.infer<
    typeof participantCreationParser
  >;

  if (participantCreationParser.safeParse(payload).error) {
    return NextResponse.json("Invalid payload", {
      status: 400,
    });
  }

  const createdParticipant = db
    .insert(participants)
    .values({
      matchId: match.data.id,
      nickname: payload.nickname,
    })
    .returning();

  return NextResponse.json(createdParticipant, { status: 200 });
}
