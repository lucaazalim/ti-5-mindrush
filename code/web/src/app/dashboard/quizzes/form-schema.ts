import { useFormContext } from "react-hook-form";
import { z } from "zod";
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

const aiGeneratedSchema = z.object({
  ...baseFields,
  type: z.literal("THEME_GENERATED"),
  theme: z.string().min(3, "O tema deve ter pelo menos 3 caracteres"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  language: z.string().min(2, "O idioma deve ter pelo menos 2 caracteres"),
});

const pdfGeneratedSchema = z.object({
  ...baseFields,
  type: z.literal("PDF_GENERATED"),
  pdfBase64: z.string().min(1, "Faça o upload de um arquivo PDF."),
});

export const quizCreateSchema = z.discriminatedUnion("type", [
  blankSchema,
  aiGeneratedSchema,
  pdfGeneratedSchema,
]);
