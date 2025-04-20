import { z } from "zod"; // Generic

// Generic

export const uuidParser = z
  .string()
  .uuid({
    message: "O ID informado é inválido.",
  })
  .brand<"Uuid">();

// Participant

export const participantNicknameParser = z.string().min(3).max(20).brand<"ParticipantNickname">();

// Match

export const matchPinParser = z.string().regex(/^\d{6}$/);
export const matchIdOrPinParser = uuidParser.or(matchPinParser);
