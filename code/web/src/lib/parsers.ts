import { z } from "zod";

export const uuidParser = z.string().uuid({
  message: "O ID informado é inválido.",
});

export const matchPinParser = z.string().regex(/^\d{5}$/);

export const matchIdOrPinParser = uuidParser.or(matchPinParser);
