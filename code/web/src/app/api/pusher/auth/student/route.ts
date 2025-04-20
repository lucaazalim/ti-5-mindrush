import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { env } from "~/env";
import { isUuid } from "~/lib/types";
import { selectParticipantById } from "~/server/data/participant";
import { pusherSender } from "~/server/event-publisher";

export async function POST(req: NextRequest) {
  const participantToken = req.headers.get("Token");

  if (!participantToken) {
    return new NextResponse("You need to provide a participant token in the 'Token' header.");
  }

  const participantId = jwt.verify(participantToken, env.PARTICIPANT_TOKEN_SECRET_KEY);

  if (typeof participantId !== "string" || !isUuid(participantId)) {
    return new NextResponse("The provided participant token is invalid.", { status: 403 });
  }

  const participant = await selectParticipantById(participantId);

  if (!participant) {
    return new NextResponse(
      "The participant ID extracted from the participant token does not match an existing participant.",
      { status: 403 },
    );
  }

  const requestData = await req.formData();
  const socketId = requestData.get("socket_id") as string;
  const channelName = requestData.get("channel_name") as string;
  const matchId = channelName.replace("presence-match-", "");

  if (participant.matchId !== matchId) {
    return new NextResponse("The participant ID ", { status: 403 });
  }

  const user: PresenceChannelData = {
    user_id: participant.id,
    user_info: participant,
  };

  const authResponse = pusherSender.authorizeChannel(socketId, channelName, user);
  return NextResponse.json(authResponse);
}
