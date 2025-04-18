import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { isMatchPin, isUuid } from "~/lib/branded-types";
import { participantCreationParser } from "~/lib/parsers";
import { isFailure } from "~/lib/result";
import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import { db } from "~/server/db";
import { participants } from "~/server/db/schema";
import { callMatchEvent, NewParticipantEvent } from "~/server/event-publisher";

export async function POST(req: NextRequest, { params }: { params: Promise<{ idOrPin: string }> }) {
  const { idOrPin } = await params;

  if (!(isMatchPin(idOrPin) || isUuid(idOrPin))) {
    return NextResponse.json("O ID ou PIN da partida informado é inválido.", {
      status: 400,
    });
  }

  const match = await getMatchByIdOrPin(idOrPin);

  if (isFailure(match)) {
    return NextResponse.json(match.error.message, {
      status: match.error.status,
    });
  }

  const payload = (await req.json()) as z.infer<typeof participantCreationParser>;

  if (participantCreationParser.safeParse(payload).error) {
    return NextResponse.json("O conteúdo da requisição é inválido.", {
      status: 400,
    });
  }

  const exists = await db
    .select()
    .from(participants)
    .where(eq(participants.nickname, payload.nickname));

  if (exists.length > 0) {
    return NextResponse.json("O apelido escolhido já está sendo usado por outro participante.", {
      status: 400,
    });
  }

  const [createdParticipant] = await db
    .insert(participants)
    .values({
      matchId: match.data.id,
      nickname: payload.nickname,
    })
    .returning();

  if (!createdParticipant) {
    return NextResponse.json("Erro ao criar participante.", {
      status: 500,
    });
  }

  callMatchEvent(new NewParticipantEvent(createdParticipant));

  return NextResponse.json(createdParticipant, { status: 200 });
}
