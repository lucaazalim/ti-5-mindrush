"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { uuidParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { isUuid, type NewQuiz, type Quiz, type UpdateQuiz } from "~/lib/types";
import { db } from "../db";
import { quizzes } from "../db/schema";

const quizSchema = z.object({
  educatorId: uuidParser,
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
  type: z.enum(["BLANK", "THEME_GENERATED", "PDF_GENERATED"]),
  theme: z.string().min(3, "O tema deve ter pelo menos 3 caracteres").optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  language: z.string().min(2, "O idioma deve ter pelo menos 2 caracteres").optional(),
  pdfBase64: z.string().optional(),
});

export async function createQuiz(quizData: NewQuiz): Promise<Result<Quiz, string>> {
  const parsedData = quizSchema.safeParse(quizData);
  if (!parsedData.success) {
    return fail("Dados inválidos para criação do quiz.");
  }

  try {
    const [createdQuiz] = await db.insert(quizzes).values(parsedData.data).returning();

    if (!createdQuiz) {
      return fail("Falha ao criar o quiz.");
    }

    return succeed(createdQuiz);
  } catch {
    return fail("Falha ao criar o quiz.");
  }
}

export async function updateQuiz(updateData: UpdateQuiz): Promise<Result<Quiz, string>> {
  const parsedId = uuidParser.safeParse(updateData.id);
  if (!parsedId.success) {
    return fail("ID inválido.");
  }

  const updateSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(8).optional(),
  });

  const parsedUpdate = updateSchema.safeParse(updateData);
  if (!parsedUpdate.success) {
    return fail("Dados inválidos para atualização do quiz.");
  }

  try {
    const [updatedQuiz] = await db
      .update(quizzes)
      .set(parsedUpdate.data)
      .where(eq(quizzes.id, updateData.id))
      .returning();

    if (!updatedQuiz) {
      return fail("Falha ao atualizar o quiz.");
    }

    return succeed(updatedQuiz);
  } catch {
    return fail("Falha ao atualizar o quiz.");
  }
}

export async function deleteQuiz(id: string): Promise<Result<void, string>> {
  if (!isUuid(id)) {
    return fail("ID inválido.");
  }

  try {
    await db.delete(quizzes).where(eq(quizzes.id, id));
    return succeed();
  } catch {
    return fail("Falha ao deletar quiz.");
  }
}
