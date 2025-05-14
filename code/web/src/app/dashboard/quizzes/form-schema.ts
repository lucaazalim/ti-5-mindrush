import { z } from "zod";
import { QUIZ_DIFFICULTIES, QUIZ_LANGUAGES } from "~/lib/constants";
import { uuidParser } from "~/lib/parsers";

const baseFields = z.object({
  educatorId: uuidParser,
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
  difficulty: z.enum(QUIZ_DIFFICULTIES),
  language: z.enum(QUIZ_LANGUAGES),
});

const blankSchema = z.object({
  ...baseFields.shape,
  type: z.literal("BLANK"),
});

export const themeGeneratedSchema = z.object({
  ...baseFields.shape,
  type: z.literal("THEME_GENERATED"),
});

export const pdfGeneratedSchema = z.object({
  ...baseFields.shape,
  type: z.literal("PDF_GENERATED"),
  pdfText: z.string().min(1, "Faça o upload de um arquivo PDF."),
});

export const quizCreateSchema = z.discriminatedUnion("type", [
  blankSchema,
  themeGeneratedSchema,
  pdfGeneratedSchema,
]);
