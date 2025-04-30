import { NextRequest, NextResponse } from "next/server";
import { ChannelAuthResponse, PresenceChannelData } from "pusher";
import { APIError, apiErrorResponse, authParticipant } from "~/app/api/api";
import { pusherSender } from "~/lib/pusher/publisher";
import { isFailure } from "~/lib/result";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ChannelAuthResponse | APIError>> {
  const participant = await authParticipant(req);

  if (isFailure(participant)) {
    return apiErrorResponse(participant.error);
  }

  if (!participant) {
    return apiErrorResponse({
      status: 403,
      message: "Participant not found.",
      code: "participant_not_found",
    });
  }

  const { id: participantId, matchId } = participant.data;

  const requestData = await req.formData();
  const socketId = requestData.get("socket_id") as string;
  const channelName = requestData.get("channel_name") as string;

  if (matchId !== channelName.slice(-36)) {
    return apiErrorResponse({
      status: 403,
      message: "The participant's match ID does not match the channel's match ID.",
      code: "match_id_mismatch",
    });
  }

  const user: PresenceChannelData = {
    user_id: participantId,
    user_info: participant,
  };

  const authResponse = pusherSender.authorizeChannel(socketId, channelName, user);
  return NextResponse.json(authResponse);
}
