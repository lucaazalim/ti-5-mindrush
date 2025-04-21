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
      question: z.string().min(1, "A pergunta não pode estar vazia"),
      alternatives: z.array(z.string().min(1)).min(2).max(4),
      correctAlternativeIndex: z.number().min(0),
      type: z.enum(QUESTION_TYPES),
    }),
  ),
});

// Participant

export const participantNicknameParser = z.string().min(3).max(20).brand<"ParticipantNickname">();

// Match

export const matchPinParser = z.string().regex(/^\d{6}$/);
export const matchIdOrPinParser = uuidParser.or(matchPinParser);
