"use server";

import { z } from "zod";
import { db } from "./db";
import { quiz } from "./db/schema";
import { eq } from "drizzle-orm";

const quizIdSchema = z.string().uuid();
const quizSchema = z.object({
  educatorId: z.string().uuid(),
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
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

export async function createQuiz(
  educatorId: string,
  title: string,
  description: string
) {
  const parsedData = quizSchema.safeParse({ educatorId, title, description });
  if (!parsedData.success) {
    throw new Error("Dados inválidos para criação do quiz");
  }

  return await db.insert(quiz).values(parsedData.data);
}

export async function updateQuiz(
  id: string,
  title?: string,
  description?: string
) {
  const parsedId = quizIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido");
  }

  const updateSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
  });

  const parsedUpdate = updateSchema.safeParse({ title, description });
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
