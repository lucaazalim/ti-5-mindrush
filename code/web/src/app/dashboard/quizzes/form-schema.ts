import {z} from "zod";
import {useFormContext} from "react-hook-form";

export type CreateQuizSchema = z.infer<typeof quizCreateSchema>;

export function useCreateQuizFormContext() {
    return useFormContext<CreateQuizSchema>();
}

export const quizCreateSchema = z
    .object({
        educatorId: z.string().uuid(),
        title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
        description: z
            .string()
            .min(8, "A descrição deve ter pelo menos 8 caracteres"),
        type: z.enum(["BLANK", "AI_GENERATED", "PDF_GENERATED"]),
        theme: z
            .string()
            .min(3, "O tema deve ter pelo menos 3 caracteres")
            .optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
        language: z
            .string()
            .min(2, "O idioma deve ter pelo menos 2 caracteres")
            .optional(),
        pdfBase64: z.string().optional(),
    })
    .refine((data) => data.type !== "AI_GENERATED" || !!data.theme, {
        message: "O tema é obrigatório para quizzes gerados por IA.",
        path: ["theme"],
    })
    .refine((data) => data.type !== "AI_GENERATED" || !!data.difficulty, {
        message: "A dificuldade é obrigatória para quizzes gerados por IA.",
        path: ["difficulty"],
    })
    .refine((data) => data.type !== "AI_GENERATED" || !!data.language, {
        message: "O idioma é obrigatório para quizzes gerados por IA.",
        path: ["language"],
    })
    .refine((data) => data.type !== "PDF_GENERATED" || !!data.pdfBase64, {
        message: "Faça o upload de um arquivo PDF.",
        path: ["pdfBase64"],
    });