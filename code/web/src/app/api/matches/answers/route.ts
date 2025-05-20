import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { insertQuizAnswer, selectQuizAnswer } from "~/lib/data/answer";
import { selectPopulatedMatchById } from "~/lib/data/match";
import { uuidParser } from "~/lib/parsers";
import { publishMatchEvent } from "~/lib/pusher/publisher";
import { isFailure } from "~/lib/result";
import { calculatePoints, hasCurrentQuestion, hasCurrentQuestionTimeEnded } from "~/lib/utils";
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
  const match = await selectPopulatedMatchById(matchId, { internal: true });

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

  if (!hasCurrentQuestion(match)) {
    return apiErrorResponse({
      status: 400,
      message: "The match does not have a current question.",
      code: "no_current_question",
    });
  }

  if (hasCurrentQuestionTimeEnded(match)) {
    return apiErrorResponse({
      status: 400,
      message: "The time for answering the question has expired.",
      code: "question_time_expired",
    });
  }

  if (!match.currentQuestion) {
    return apiErrorResponse({
      status: 404,
      message: "Question not found.",
      code: "question_not_found",
    });
  }

  const correctAlternative = match.currentQuestion.alternatives.find(
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

  const alternative = match.currentQuestion.alternatives.find(
    (alternative) => alternative.id === alternativeId,
  );

  if (!alternative) {
    return apiErrorResponse({
      status: 404,
      message: "Alternative not found.",
      code: "alternative_not_found",
    });
  }

  const existingAnswer = await selectQuizAnswer(participantId, match.currentQuestion.id);

  if (existingAnswer) {
    return apiErrorResponse({
      status: 400,
      message: "You have already answered this question.",
      code: "already_answered",
    });
  }

  const isCorrect = correctAlternative.id === alternativeId;

  const timeLimit = match.currentQuestion.timeLimit * 1000; // ms
  const timeTaken = Date.now() - match.currentQuestionStartedAt.getTime(); // ms
  const correctBefore = match.currentQuestion?.alternatives.reduce(
    (acc, alternative) => acc + alternative.count,
    0,
  );
  const totalParticipants = match.participants.length;

  const points = calculatePoints(isCorrect, timeLimit, timeTaken, correctBefore, totalParticipants);

  await insertQuizAnswer({
    participantId,
    questionId: match.currentQuestion.id,
    matchId,
    alternativeId,
    isCorrect,
    timeTaken,
    points,
  });

  await publishMatchEvent(match, "question-answered-event");

  return new NextResponse(null, {
    status: 201,
  });
}
