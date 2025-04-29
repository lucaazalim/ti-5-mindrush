import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { APIError, apiErrorResponse } from "~/app/api/api";
import { env } from "~/env";
import { participantNicknameParser } from "~/lib/parsers";
import { isMatchPin, isUuid, Participant } from "~/lib/types";
import { getAvatarUrl } from "~/lib/utils";
import { selectMatchByIdOrPin } from "~/server/data/match";
import { existsParticipantWithNickname, insertParticipant } from "~/server/data/participant";
import { callMatchEvent, NewParticipantEvent } from "~/server/event-publisher";

const payloadParser = z.object({
  nickname: participantNicknameParser,
});

type CreatedParticipant = Participant & {
  token: string;
  avatarUrl: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ idOrPin: string }> },
): Promise<NextResponse<CreatedParticipant | APIError>> {
  const { idOrPin } = await params;

  if (!(isMatchPin(idOrPin) || isUuid(idOrPin))) {
    return apiErrorResponse({
      status: 400,
      message: "The match ID or PIN provided is invalid.",
      code: "invalid_match_id_or_pin",
    });
  }

  const match = await selectMatchByIdOrPin(idOrPin);

  if (!match) {
    return apiErrorResponse({
      status: 404,
      message: "Match not found.",
      code: "match_not_found",
    });
  }

  if (match.status !== "WAITING") {
    return apiErrorResponse({
      status: 400,
      message: "Match is already running or has already ended.",
      code: "match_not_waiting",
    });
  }

  const payload = payloadParser.safeParse(await req.json());

  if (!payload.success) {
    return apiErrorResponse({
      status: 400,
      message: "Invalid payload: " + payload.error.message,
      code: "invalid_payload",
    });
  }

  const { nickname } = payload.data;

  if (await existsParticipantWithNickname(match.id, nickname)) {
    return apiErrorResponse({
      status: 400,
      message: "The provided nickname is already being used by another participant.",
      code: "nickname_already_used",
    });
  }

  const createdParticipant = await insertParticipant({
    matchId: match.id,
    nickname: nickname,
  });

  if (!createdParticipant) {
    return apiErrorResponse({
      status: 500,
      message: "There was an error while trying to create the participant.",
      code: "participant_creation_error",
    });
  }

  await callMatchEvent(new NewParticipantEvent(createdParticipant));

  const token = jwt.sign(createdParticipant.id, env.PARTICIPANT_TOKEN_SECRET_KEY);

  return NextResponse.json(
    {
      ...createdParticipant,
      token,
      avatarUrl: getAvatarUrl(createdParticipant),
    },
    { status: 200 },
  );
}
