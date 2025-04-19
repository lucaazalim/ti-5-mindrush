import { NextRequest, NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { auth } from "~/server/auth";
import { selectQuizByMatchId } from "~/server/data/quiz";
import { pusherSender } from "~/server/event-publisher";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("You are not authenticated as an educator.", { status: 403 });
  }

  const requestData = await req.formData();
  const socketId = requestData.get("socket_id") as string;
  const channelName = requestData.get("channel_name") as string;
  const matchId = channelName.replace("presence-match-", "");

  const user: PresenceChannelData = {
    user_id: session.user.id,
    user_info: session,
  };

  const quiz = await selectQuizByMatchId(matchId);

  if (!quiz) {
    return new NextResponse("The match's associated quiz does not exist.", { status: 403 });
  }

  const authResponse = pusherSender.authorizeChannel(socketId, channelName, user);
  return NextResponse.json(authResponse);
}
