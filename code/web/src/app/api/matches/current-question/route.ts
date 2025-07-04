import { NextRequest, NextResponse } from "next/server";
import { authParticipant } from "~/app/api/api";
import { isFailure } from "~/lib/result";
import { QuestionWithAlternativesWithoutCorrect } from "~/lib/types";
import { selectMatchByIdOrPin } from "~/lib/data/match";
import { selectQuestionWithAlternatives } from "~/lib/data/question";
import { APIError, apiErrorResponse } from "../../api";
import { hasCurrentQuestion } from "~/lib/utils";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<APIError | QuestionWithAlternativesWithoutCorrect>> {
  const participant = await authParticipant(req);

  if (isFailure(participant)) {
    return apiErrorResponse(participant.error);
  }

  const { matchId } = participant.data;
  const match = await selectMatchByIdOrPin(matchId);

  if (!match) {
    return apiErrorResponse({
      status: 404,
      message: "Match not found.",
      code: "match_not_found",
    });
  }

  if (match.status !== "RUNNING") {
    return apiErrorResponse({
      status: 400,
      message: "The match state must be RUNNING.",
      code: "match_not_running",
    });
  }

  if (!hasCurrentQuestion(match)) {
    return apiErrorResponse({
      status: 400,
      message: "The match does not have a current question.",
      code: "no_current_question",
    });
  }

  const currentQuestion = await selectQuestionWithAlternatives(match.currentQuestionId, {
    internal: true,
  });

  if (!currentQuestion) {
    return apiErrorResponse({
      status: 404,
      message: "Current question not found.",
      code: "current_question_not_found",
    });
  }

  return NextResponse.json({
    ...currentQuestion,
    alternatives: currentQuestion.alternatives.map((alternative) => ({
      ...alternative,
      isCorrect: undefined, // This avoid the correct answer to be shared with the participants
    })),
  });
}
