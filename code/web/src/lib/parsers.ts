import { z } from "zod"; // Generic
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

// Quiz

export const updateQuizParser = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(8).optional(),
});

// Question

export const questionAndAlternativesParser = z.object({
  quizId: uuidParser,
  questions: z.array(
    z.object({
      question: z.string().min(3, "A questão deve conter pelo menos 3 caracteres."),
      order: z.number().nonnegative().int(),
      alternatives: z
        .array(z.string().min(1, "A alternativa deve conter pelo menos 1 caractere."))
        .min(2, "A questão deve ter pelo menos 2 alternativas.")
        .max(4, "A questão deve ter no máximo 4 alternativas."),
      correctAlternativeIndex: z.number().min(0),
      type: z.enum(QUESTION_TYPES),
      image: z.string().url().nullable().optional(),
    }),
  ),
});

// Participant

export const participantNicknameParser = z.string().min(3).max(20).brand<"ParticipantNickname">();

// Match

export const matchPinParser = z.string().regex(/^\d{6}$/);
export const matchIdOrPinParser = uuidParser.or(matchPinParser);
