import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import { participantNicknameParser } from "~/lib/parsers";
import { isMatchPin, isUuid } from "~/lib/types";
import { selectMatchByIdOrPin } from "~/server/data/match";
import { existsParticipantWithNickname, insertParticipant } from "~/server/data/participant";
import { callMatchEvent, NewParticipantEvent } from "~/server/event-publisher";

const payloadParser = z.object({
  nickname: participantNicknameParser,
});

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

  if (match.state !== "WAITING") {
    return NextResponse.json("A partida já foi iniciada.", {
      status: 400,
    });
  }

  const payload = (await req.json()) as z.infer<typeof payloadParser>;

  if (payloadParser.safeParse(payload).error) {
    return NextResponse.json("O conteúdo da requisição é inválido.", {
      status: 400,
    });
  }

  if (await existsParticipantWithNickname(match.id, payload.nickname)) {
    return NextResponse.json("O apelido escolhido já está sendo usado por outro participante.", {
      status: 400,
    });
  }

  const createdParticipant = await insertParticipant({
    matchId: match.id,
    nickname: payload.nickname,
  });

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
