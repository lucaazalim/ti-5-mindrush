import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match, Participant, PopulatedMatch, RequireDefined } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CurrentQuestionFields = Pick<
  Match,
  "currentQuestionId" | "currentQuestionStartedAt" | "currentQuestionEndsAt"
>;

export function getAvatarUrl({ id }: Pick<Participant, "id">) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${id}&textureProbability=0`;
}

export function getMatchChannel({ id }: Pick<Match, "id">) {
  return `presence-match-${id}`;
}

export function hasCurrentQuestionTimeEnded(match: Pick<Match, "currentQuestionEndsAt">) {
  return !!match.currentQuestionEndsAt && match.currentQuestionEndsAt.getTime() < Date.now();
}

export function getCurrentQuestionTimeLeft(match: CurrentQuestionFields): number {
  if (!hasCurrentQuestion(match)) return 0;
  return Math.max(0, match.currentQuestionEndsAt.getTime() - Date.now());
}

export function hasNextQuestion({
  currentQuestionId,
  quiz,
}: Pick<PopulatedMatch, "currentQuestionId" | "quiz">) {
  return currentQuestionId !== quiz.questions.at(-1)?.id;
}

export function hasCurrentQuestion(
  currentQuestionData: CurrentQuestionFields,
): currentQuestionData is RequireDefined<CurrentQuestionFields, keyof CurrentQuestionFields> {
  return Boolean(
    currentQuestionData.currentQuestionId &&
      currentQuestionData.currentQuestionStartedAt &&
      currentQuestionData.currentQuestionEndsAt,
  );
}
