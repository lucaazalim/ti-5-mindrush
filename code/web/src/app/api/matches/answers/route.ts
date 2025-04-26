import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uuidParser } from "~/lib/parsers";
import { isFailure } from "~/lib/result";
import { insertQuizAnswer, selectQuizAnswer } from "~/server/data/answer";
import { selectMatchByIdOrPin } from "~/server/data/match";
import { selectQuestionWithAlternatives } from "~/server/data/question";
import { apiErrorResponse, authParticipant } from "../../api";

const payloadParser = z.object({
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

  const { id: participantId, matchId } = participant.data;
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
      message: "Match is not running.",
      code: "match_not_running",
    });
  }

  if (!match.currentQuestionId || !match.currentQuestionStartedAt || !match.currentQuestionEndsAt) {
    return apiErrorResponse({
      status: 400,
      message: "The match does not have a current question.",
      code: "no_current_question",
    });
  }

  if (match.currentQuestionEndsAt < new Date()) {
    return apiErrorResponse({
      status: 400,
      message: "The time for answering the question has expired.",
      code: "question_time_expired",
    });
  }

  const currentQuestion = await selectQuestionWithAlternatives(match.currentQuestionId, {
    internal: true,
  });

  if (!currentQuestion) {
    return apiErrorResponse({
      status: 404,
      message: "Question not found.",
      code: "question_not_found",
    });
  }

  const correctAlternative = currentQuestion.alternatives.find(
    (alternative) => alternative.isCorrect,
  );

  if (!correctAlternative) {
    return apiErrorResponse({
      status: 404,
      message: "Current question does not have a correct alternative.",
      code: "no_correct_alternative",
    });
  }

  const { alternativeId } = payload.data;

  const alternative = currentQuestion.alternatives.find(
    (alternative) => alternative.id === alternativeId,
  );

  if (!alternative) {
    return apiErrorResponse({
      status: 404,
      message: "Alternative not found.",
      code: "alternative_not_found",
    });
  }

  const existingAnswer = await selectQuizAnswer(participantId, currentQuestion.id);

  if (existingAnswer) {
    return apiErrorResponse({
      status: 400,
      message: "You have already answered this question.",
      code: "already_answered",
    });
  }

  const isCorrect = correctAlternative.id === alternativeId;

  const timeLimit = currentQuestion.timeLimit * 1000; // ms
  const timeTaken = Date.now() - match.currentQuestionStartedAt.getTime(); // ms
  const points = isCorrect ? Math.round((1 - timeTaken / timeLimit) * 1000) : 0;

  await insertQuizAnswer({
    participantId,
    questionId: currentQuestion.id,
    matchId,
    alternativeId,
    isCorrect,
    timeTaken,
    points,
  });

  return new NextResponse(null, {
    status: 201,
  });
}
