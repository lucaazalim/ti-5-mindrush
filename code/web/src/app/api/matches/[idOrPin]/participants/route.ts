import { type NextRequest, NextResponse } from "next/server";
import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import { participantCreationParser } from "~/lib/parsers";
import type { z } from "zod";
import { db } from "~/server/db";
import { participants } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { isFailure } from "~/lib/result";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ idOrPin: string }> },
) {
  const { idOrPin } = await params;
  const match = await getMatchByIdOrPin(idOrPin);

  if (isFailure(match)) {
    return NextResponse.json(match.error.message, {
      status: match.error.status,
    });
  }

  const payload = (await req.json()) as z.infer<
    typeof participantCreationParser
  >;

  if (participantCreationParser.safeParse(payload).error) {
    return NextResponse.json("O conteúdo da requisição é inválido.", {
      status: 400,
    });
  }

  const exists = await db
    .select()
    .from(participants)
    .where(eq(participants.nickname, payload.nickname));

  if (exists) {
    return NextResponse.json(
      "O apelido escolhido já está sendo usado por outro participante.",
      { status: 400 },
    );
  }

  const createdParticipant = await db
    .insert(participants)
    .values({
      matchId: match.data.id,
      nickname: payload.nickname,
    })
    .returning();

  return NextResponse.json(createdParticipant, { status: 200 });
}
