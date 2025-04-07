"use server";

import { z } from "zod";
import { db } from "../db";
import { questions, quizQuestionsAlternatives, quizzes } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import { type Quiz, type QuizUpdate } from "~/lib/types";

const quizIdSchema = z.string().uuid();
const quizSchema = z.object({
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
});

export async function getAllQuizzes() {

  const alQuizzes = await db.select().from(quizzes);

  const quizQuestions = await db
    .select({ id: questions.id, quizId: questions.quizId })
    .from(questions);

  const questionCountByQuiz: Record<string, number> = {};

  quizQuestions.forEach((q) => {
    questionCountByQuiz[q.quizId] = (questionCountByQuiz[q.quizId] ?? 0) + 1;
  });

  return alQuizzes.map((q) => ({
    ...q,
    questionCount: questionCountByQuiz[q.id] ?? 0,
  }));
}

export async function getQuizById(id: string) {
  const parsedId = quizIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido");
  }

  return db.query.quizzes.findFirst({
    where: eq(quizzes.id, id),
  });
}

export async function createQuiz(quizData: Quiz): Promise<{ id: string }> {
  const parsedData = quizSchema.safeParse(quizData);
  if (!parsedData.success) {
    throw new Error("Dados inválidos para criação do quiz");
  }

  const [created] = await db
    .insert(quizzes)
    .values(parsedData.data)
    .returning({ id: quizzes.id });

  if (!created?.id) {
    throw new Error("Falha ao criar quiz: ID não retornado");
  }

  return created;
}

export async function updateQuiz(id: string, updateData: QuizUpdate) {
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

  return db.update(quizzes).set(parsedUpdate.data).where(eq(quizzes.id, id));
}

export async function deleteQuiz(id: string) {
  const parsedId = quizIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("ID inválido");
  }

  const allQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, id));

  const questionIds = allQuestions.map((q) => q.id);

  if (questionIds.length > 0) {
    await db
      .delete(quizQuestionsAlternatives)
      .where(inArray(quizQuestionsAlternatives.questionId, questionIds));
  }

  await db.delete(questions).where(eq(questions.quizId, id));

  return db.delete(quizzes).where(eq(quizzes.id, id));
}

export async function getQuestionsByQuizId(quizId: string) {
  const allQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId));

  const allAlternatives = await db.select().from(quizQuestionsAlternatives);

  return allQuestions.map((q) => ({
    ...q,
    type: q.type === "TRUE_OR_FALSE" ? "TRUE_OR_FALSE" : "QUIZ",
    alternatives: allAlternatives.filter((a) => a.questionId === q.id),
  }));
}
