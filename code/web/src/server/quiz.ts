"use server";

import { z } from "zod";
import { db } from "./db";
import { quiz } from "./db/schema";
import { eq } from "drizzle-orm";

export type QuizInput = {
  educatorId: string;
  title: string;
  description: string;
  type: "BLANK" | "AI_GENERATED" | "PDF_GENERATED";
  theme?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  language?: string;
  pdfBase64?: string;
};

type QuizUpdateInput = {
  title?: string;
  description?: string;
};

const quizIdSchema = z.string().uuid();
const quizSchema = z.object({
  educatorId: z.string().uuid(),
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
  type: z.enum(["BLANK", "AI_GENERATED", "PDF_GENERATED"]),
  theme: z.string().min(3, "O tema deve ter pelo menos 3 caracteres").optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  language: z.string().min(2, "O idioma deve ter pelo menos 2 caracteres").optional(),
  pdfBase64: z.string().optional(),
});

export async function getAllQuizzes() {
  return await db.query.quiz.findMany();
}

export async function getQuizById(id: string) {
  const parsedId = quizIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido");
  }

  return await db.query.quiz.findFirst({
    where: eq(quiz.id, id),
  });
}

export async function createQuiz(quizData: QuizInput) {
  const parsedData = quizSchema.safeParse(quizData);
  if (!parsedData.success) {
    throw new Error("Dados inválidos para criação do quiz");
  }

  return await db.insert(quiz).values(parsedData.data);
}

export async function updateQuiz(id: string, updateData: QuizUpdateInput) {
  const parsedId = quizIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido");
  }

  const updateSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(8).optional(),
  });

  const parsedUpdate = updateSchema.safeParse(updateData);
  if (!parsedUpdate.success) {
    throw new Error("Dados inválidos para atualização do quiz");
  }

  return await db.update(quiz).set(parsedUpdate.data).where(eq(quiz.id, id));
}

export async function deleteQuiz(id: string) {
  const parsedId = quizIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido");
  }

  return await db.delete(quiz).where(eq(quiz.id, id));
}
