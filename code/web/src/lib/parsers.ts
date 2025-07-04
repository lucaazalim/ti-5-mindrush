import { z } from "zod";
import { QUESTION_TYPES } from "./constants";

// Generic

export const uuidParser = z
  .string({
    message: "O ID informado é inválido.",
  })
  .uuid({
    message: "O ID informado é inválido.",
  })
  .brand<"Uuid">();

export type Uuid = z.infer<typeof uuidParser>;

/**
 * Parses and validates a UUID string.
 *
 * @param uuid The string to validate as a UUID.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function isUuid(uuid: string): uuid is Uuid {
  return uuidParser.safeParse(uuid).success;
}

// Quiz

export const updateQuizParser = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(8).optional(),
});

export type UpdateQuiz = z.infer<typeof updateQuizParser>;

// Question

export const questionWithAlternativesParser = z.object({
  id: uuidParser.optional(),
  question: z.string().min(1, { message: "A pergunta deve conter pelo menos 1 caractere." }),
  type: z.enum(QUESTION_TYPES),
  timeLimit: z
    .number()
    .min(5, { message: "O tempo limite deve ser de no mínimo 5 segundos." })
    .max(3600, { message: "O tempo limite deve ser de no máximo 3600 segundos." }),
  order: z.number().nonnegative(),
  image: z.string().nullable().optional(),
  alternatives: z.array(z.string()),
  correctAlternativeIndex: z.number(),
});

export const quizWithQuestionsAndAlternativesParser = z.object({
  quizId: uuidParser,
  questions: z.array(questionWithAlternativesParser),
});

export type RawQuestionsWithAlternatives = z.infer<typeof quizWithQuestionsAndAlternativesParser>;

// Participant Nickname

export const participantNicknameParser = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[\p{L}\p{N} ]+$/u, "Nickname can only contain letters, numbers, and spaces.")
  .brand<"ParticipantNickname">();

export type ParticipantNickname = z.infer<typeof participantNicknameParser>;

/**
 * Parses and validates a participant nickname.
 *
 * @param nickname The string to validate as a participant nickname.
 * @returns True if the string is a valid participant nickname, false otherwise.
 */
export function isParticipantNickname(nickname: string): nickname is ParticipantNickname {
  return participantNicknameParser.safeParse(nickname).success;
}

// Match Pin

export const matchPinParser = z.string().regex(/^\d{6}$/);

export type MatchPin = z.infer<typeof matchPinParser>;

/**
 * Parses and validates a match PIN.
 *
 * @param pin The string to validate as a match PIN.
 * @returns True if the string is a valid match PIN, false otherwise.
 */
export function isMatchPin(pin: string): pin is MatchPin {
  return matchPinParser.safeParse(pin).success;
}
