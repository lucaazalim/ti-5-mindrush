import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match, Participant, PopulatedMatch, RequireDefined } from "./types";

/**
 * Combines multiple class names into a single string, removing duplicates and merging Tailwind classes.
 *
 * @param inputs An array of class values to combine
 * @returns A single string of combined class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CurrentQuestionFields = Pick<
  Match,
  "currentQuestionId" | "currentQuestionStartedAt" | "currentQuestionEndsAt"
>;

/**
 * Generates the avatar URL for a participant.
 *
 * @param id The unique identifier of the participant
 * @returns The URL of the participant's avatar
 */
export function getAvatarUrl({ id }: Pick<Participant, "id">) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${id}&textureProbability=0`;
}

/**
 * Constructs the match channel name for a given match.
 *
 * @param id The unique identifier of the match
 * @returns The name of the match channel
 */
export function getMatchChannel({ id }: Pick<Match, "id">) {
  return `presence-match-${id}`;
}

/**
 * Checks if the current question's time has ended.
 *
 * @param match An object containing the current question's end time
 * @returns True if the current question's time has ended, false otherwise
 */
export function hasCurrentQuestionTimeEnded(match: Pick<Match, "currentQuestionEndsAt">) {
  return !!match.currentQuestionEndsAt && match.currentQuestionEndsAt.getTime() < Date.now();
}

/**
 * Calculates the remaining time for the current question.
 *
 * @param match An object containing the current question's time fields
 * @returns The remaining time in milliseconds, or 0 if no current question exists
 */
export function getCurrentQuestionTimeLeft(match: CurrentQuestionFields): number {
  if (!hasCurrentQuestion(match)) return 0;
  return Math.max(0, match.currentQuestionEndsAt.getTime() - Date.now());
}

/**
 * Determines if there is a next question in the quiz.
 *
 * @param currentQuestionId The ID of the current question
 * @param quiz The quiz object containing the list of questions
 * @returns True if there is a next question, false otherwise
 */
export function hasNextQuestion({
  currentQuestionId,
  quiz,
}: Pick<PopulatedMatch, "currentQuestionId" | "quiz">) {
  return currentQuestionId !== quiz.questions.at(-1)?.id;
}

/**
 * Checks if the current question data is fully defined.
 *
 * @param currentQuestionData The current question's data fields
 * @returns True if all required fields are defined, false otherwise
 */
export function hasCurrentQuestion(
  currentQuestionData: CurrentQuestionFields,
): currentQuestionData is RequireDefined<CurrentQuestionFields, keyof CurrentQuestionFields> {
  return Boolean(
    currentQuestionData.currentQuestionId &&
      currentQuestionData.currentQuestionStartedAt &&
      currentQuestionData.currentQuestionEndsAt,
  );
}

/**
 * Calculates the points for an answer.
 *
 * @param isCorrect true if the answer is correct, false otherwise
 * @param timeLimit the time limit for the question in milliseconds
 * @param timeTaken the time taken to answer the question in milliseconds
 * @returns the points for the answer
 */
export function calculateAnswerPoints(isCorrect: boolean, timeLimit: number, timeTaken: number) {
  return isCorrect ? Math.round((1 - timeTaken / timeLimit) * 1000) : 0;
}
