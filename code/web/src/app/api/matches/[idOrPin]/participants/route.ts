import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { env } from "~/env";
import { participantCreationParser } from "~/lib/parsers";
import { isMatchPin, isUuid } from "~/lib/types";
import { selectMatchByIdOrPin } from "~/server/data/match";
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

  const match = await selectMatchByIdOrPin(idOrPin);

  if (!match) {
    return NextResponse.json("A partida informada não existe.", {
      status: 404,
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
      matchId: match.id,
      nickname: payload.nickname,
    })
    .returning();

  if (!createdParticipant) {
    return NextResponse.json("Erro ao criar participante.", {
      status: 500,
    });
  }

  await callMatchEvent(new NewParticipantEvent(createdParticipant));

  const token = jwt.sign(createdParticipant.id, env.PARTICIPANT_TOKEN_SECRET_KEY);

  return NextResponse.json(
    {
      ...createdParticipant,
      token,
    },
    { status: 200 },
  );
}
