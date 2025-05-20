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
 * Calculates the score for a quiz question similar to Kahoot.
 *
 * Rules:
 * - Participants that got the question wrong receive 0 points.
 * - The score ranges from 0 to 1000.
 * - The score is based on:
 *   - How fast the participant answered (up to 50% of the score).
 *   - How many participants had already answered correctly (up to 50% of the score).
 *
 * @param isCorrect - Indicates whether the participant answered correctly.
 * @param timeLimit - The total time limit to answer the question in milliseconds.
 * @param timeTaken - The time taken by the participant to answer in milliseconds.
 * @param correctBefore - The number of participants who answered correctly before this participant.
 * @param totalParticipants - The total number of participants for this question.
 * @returns A score between 0 and 1000.
 */
export function calculatePoints(
  isCorrect: boolean,
  timeLimit: number,
  timeTaken: number,
  correctBefore: number,
  totalParticipants: number,
): number {
  if (!isCorrect) return 0;

  const timeFactor = 0.5; // 50% of the score is based on speed
  const speedScore = 1 - Math.min(timeTaken / timeLimit, 1); // Normalize speed (0 to 1)
  const timeScore = speedScore * (1000 * timeFactor);

  const accuracyFactor = 1 - correctBefore / Math.max(totalParticipants, 1); // Normalize accuracy (0 to 1)
  const accuracyScore = accuracyFactor * (1000 * (1 - timeFactor));

  const totalScore = Math.round(timeScore + accuracyScore);

  return Math.min(1000, Math.max(0, totalScore));
}
