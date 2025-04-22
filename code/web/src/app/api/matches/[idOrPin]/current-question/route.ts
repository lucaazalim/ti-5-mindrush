import { NextRequest, NextResponse } from "next/server";
import { authParticipant } from "~/app/api/participant-auth";
import { isFailure } from "~/lib/result";
import { isMatchPin, isUuid } from "~/lib/types";
import { selectMatchByIdOrPin } from "~/server/data/match";
import { selectQuestionWithAlternatives } from "~/server/data/question";

export async function GET(req: NextRequest, { params }: { params: Promise<{ idOrPin: string }> }) {
  const auth = authParticipant(req);

  if (isFailure(auth)) {
    return new NextResponse(auth.error, { status: 401 });
  }

  const { idOrPin } = await params;

  if (!(isMatchPin(idOrPin) || isUuid(idOrPin))) {
    return NextResponse.json("The match ID or PIN provided is not valid.", {
      status: 400,
    });
  }

  const match = await selectMatchByIdOrPin(idOrPin);

  if (!match) {
    return NextResponse.json("Match not found.", {
      status: 404,
    });
  }

  if (match.state !== "RUNNING") {
    return NextResponse.json("The match state must be RUNNING.", {
      status: 400,
    });
  }

  if (!match.currentQuestionId) {
    return NextResponse.json("The match does not have a current question.", {
      status: 400,
    });
  }

  const currentQuestion = await selectQuestionWithAlternatives(match.currentQuestionId);

  if (!currentQuestion) {
    return NextResponse.json("Current question not found.", {
      status: 404,
    });
  }

  return NextResponse.json({
    ...currentQuestion,
    alternatives: currentQuestion.alternatives.map((alternative) => ({
      ...alternative,
      correct: undefined, // This avoid the correct answer to be shared with the participants
    })),
  });
}
