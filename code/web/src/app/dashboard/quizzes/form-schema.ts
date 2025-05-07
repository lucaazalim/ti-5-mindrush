import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { QUIZ_DIFFICULTIES, QUIZ_LANGUAGES } from "~/lib/constants";
import { uuidParser } from "~/lib/parsers";

export type CreateQuizSchema = z.infer<typeof quizCreateSchema>;

export function useCreateQuizFormContext() {
  return useFormContext<CreateQuizSchema>();
}

const baseFields = {
  educatorId: uuidParser,
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
};

const blankSchema = z.object({
  ...baseFields,
  type: z.literal("BLANK"),
});

export const themeGeneratedSchema = z.object({
  ...baseFields,
  type: z.literal("THEME_GENERATED"),
  difficulty: z.enum(QUIZ_DIFFICULTIES),
  language: z.enum(QUIZ_LANGUAGES),
});

const pdfGeneratedSchema = z.object({
  ...baseFields,
  type: z.literal("PDF_GENERATED"),
  pdfBase64: z.string().min(1, "Faça o upload de um arquivo PDF."),
});

export const quizCreateSchema = z.discriminatedUnion("type", [
  blankSchema,
  themeGeneratedSchema,
  pdfGeneratedSchema,
]);
