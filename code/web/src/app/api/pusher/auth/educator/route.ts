import { NextRequest, NextResponse } from "next/server";
import { ChannelAuthResponse, PresenceChannelData } from "pusher";
import { APIError, apiErrorResponse } from "~/app/api/api";
import { pusherSender } from "~/lib/pusher/publisher";
import { isUuid } from "~/lib/types";
import { auth } from "~/server/auth";
import { selectQuizByMatchId } from "~/server/data/quiz";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ChannelAuthResponse | APIError>> {
  const session = await auth();

  if (!session) {
    return apiErrorResponse({
      status: 401,
      message: "You are not authenticated as an educator.",
      code: "unauthenticated_educator",
    });
  }

  const requestData = await req.formData();
  const socketId = requestData.get("socket_id") as string;
  const channelName = requestData.get("channel_name") as string;
  const matchId = channelName.replace("presence-match-", "");

  if (!isUuid(matchId)) {
    return apiErrorResponse({
      status: 400,
      message: "Invalid match ID.",
      code: "invalid_match_id",
    });
  }

  const user: PresenceChannelData = {
    user_id: session.user.id,
    user_info: session,
  };

  const quiz = await selectQuizByMatchId(matchId);

  if (!quiz) {
    return apiErrorResponse({
      status: 403,
      message: "The match's associated quiz does not exist.",
      code: "quiz_not_found",
    });
  }

  const authResponse = pusherSender.authorizeChannel(socketId, channelName, user);
  return NextResponse.json(authResponse);
}
