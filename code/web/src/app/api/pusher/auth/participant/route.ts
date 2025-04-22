import { NextRequest, NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { authParticipant } from "~/app/api/participant-auth";
import { isFailure } from "~/lib/result";
import { selectParticipantById } from "~/server/data/participant";
import { pusherSender } from "~/server/event-publisher";

export async function POST(req: NextRequest) {
  const auth = authParticipant(req);

  if (isFailure(auth)) {
    return new NextResponse(auth.error, { status: 401 });
  }

  const participant = await selectParticipantById(auth.data);

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
