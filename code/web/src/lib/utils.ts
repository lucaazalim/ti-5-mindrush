import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match, Participant, PopulatedMatch, Uuid } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(participant: Participant) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${participant.id}&textureProbability=0`;
}

export function getMatchChannel(matchId: Uuid) {
  return `presence-match-${matchId}`;
}

export function hasCurrentQuestionTimeEnded(match: Match) {
  return !!match.currentQuestionEndsAt && match.currentQuestionEndsAt.getTime() < Date.now();
}

export function getCurrentQuestionTimeLeft(match: PopulatedMatch): number {
  if (!hasCurrentQuestion(match)) return 0;
  return Math.max(0, match.currentQuestionEndsAt.getTime() - Date.now());
}

export function hasNextQuestion(match: PopulatedMatch) {
  return match.currentQuestionId !== match.quiz.questions.at(-1)?.id;
}

export function hasCurrentQuestion(match: PopulatedMatch | Match): match is typeof match & {
  currentQuestionId: string;
  currentQuestionStartedAt: Date;
  currentQuestionEndsAt: Date;
} {
  return Boolean(
    match.currentQuestionId && match.currentQuestionStartedAt && match.currentQuestionEndsAt,
  );
}
