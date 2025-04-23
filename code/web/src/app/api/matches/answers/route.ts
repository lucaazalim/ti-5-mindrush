import { NextRequest } from "next/server";
import { z } from "zod";
import { uuidParser } from "~/lib/parsers";
import { isFailure } from "~/lib/result";
import { selectMatchByIdOrPin } from "~/server/data/match";
import { selectQuestionWithAlternatives } from "~/server/data/question";
import { apiErrorResponse, authParticipant } from "../../api";

const payloadParser = z.object({
  questionId: uuidParser,
  alternativeId: uuidParser,
});

export async function POST(req: NextRequest) {
  const participant = await authParticipant(req);

  if (isFailure(participant)) {
    return apiErrorResponse(participant.error);
  }

  const payload = payloadParser.safeParse(await req.json());

  if (!payload.success) {
    return apiErrorResponse({
      status: 400,
      message: "Invalid payload: " + payload.error.message,
      code: "invalid_payload",
    });
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

  if (match.state !== "RUNNING") {
    return apiErrorResponse({
      status: 400,
      message: "The match state must be RUNNING.",
      code: "match_not_running",
    });
  }

  if (!match.currentQuestionId) {
    return apiErrorResponse({
      status: 400,
      message: "The match does not have a current question.",
      code: "no_current_question",
    });
  }

  const { questionId } = payload.data;

  const question = await selectQuestionWithAlternatives(questionId);

  if (!question) {
    return apiErrorResponse({
      status: 404,
      message: "Question not found.",
      code: "question_not_found",
    });
  }

  // TODO
}
