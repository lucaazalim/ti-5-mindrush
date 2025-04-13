"use server";

import { z } from "zod";
import { db } from "../db";
import { questions, quizQuestionsAlternatives, quizzes } from "../db/schema";
import { eq } from "drizzle-orm";
import type {
  NewQuiz,
  Quiz,
  QuizWithQuestionCount,
  QuizWithQuestionsAndAlternatives,
  UpdateQuiz,
} from "~/lib/types";
import { uuidParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";

const quizSchema = z.object({
  educatorId: uuidParser,
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(8, "A descrição deve ter pelo menos 8 caracteres"),
  type: z.enum(["BLANK", "THEME_GENERATED", "PDF_GENERATED"]),
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

export async function getAllQuizzes(): Promise<
  Result<QuizWithQuestionCount[], string>
> {
  try {
    const allQuizzes = await db.select().from(quizzes);
    const quizQuestions = await db
      .select({ id: questions.id, quizId: questions.quizId })
      .from(questions);

    const questionCountByQuiz: Record<string, number> = {};
    quizQuestions.forEach((q) => {
      questionCountByQuiz[q.quizId] = (questionCountByQuiz[q.quizId] ?? 0) + 1;
    });

    return succeed(
      allQuizzes.map((q) => ({
        ...q,
        questionCount: questionCountByQuiz[q.id] ?? 0,
      })),
    );
  } catch {
    return fail("Falha ao buscar quizzes.");
  }
}

export async function getQuizById(id: string): Promise<Result<Quiz, string>> {
  const parsedId = uuidParser.safeParse(id);
  if (parsedId.error) {
    return fail("ID inválido.");
  }

  try {
    const result = await db.select().from(quizzes).where(eq(quizzes.id, id));
    const quiz = result[0];

    if (!quiz) {
      return fail("Quiz não encontrado.");
    }

    return succeed(quiz);
  } catch {
    return fail("Falha ao buscar quiz pelo ID.");
  }
}

export async function createQuiz(
  quizData: NewQuiz,
): Promise<Result<Quiz, string>> {
  const parsedData = quizSchema.safeParse(quizData);
  if (!parsedData.success) {
    return fail("Dados inválidos para criação do quiz.");
  }

  try {
    const [createdQuiz] = await db
      .insert(quizzes)
      .values(parsedData.data)
      .returning();

    if (!createdQuiz) {
      return fail("Falha ao criar o quiz.");
    }

    return succeed(createdQuiz);
  } catch {
    return fail("Falha ao criar o quiz.");
  }
}

export async function updateQuiz(
  updateData: UpdateQuiz,
): Promise<Result<Quiz, string>> {
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
  const parsedId = uuidParser.safeParse(id);

  if (!parsedId.success) {
    return fail("ID inválido.");
  }

  try {
    await db.delete(quizzes).where(eq(quizzes.id, id));
    return succeed();
  } catch {
    return fail("Falha ao deletar quiz.");
  }
}

export async function getQuizWithQuestionsAndAlternatives(
  quizId: string,
): Promise<Result<QuizWithQuestionsAndAlternatives, string>> {
  const parsedId = uuidParser.safeParse(quizId);
  if (!parsedId.success) {
    return fail("ID do quiz inválido.");
  }

  try {
    // Fetch the quiz by ID
    const quizResult = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId));
    const quiz = quizResult[0];

    if (!quiz) {
      return fail("Quiz não encontrado.");
    }

    // Fetch all questions for the quiz
    const allQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, quizId));

    // Fetch all alternatives for the questions
    const allAlternatives = await db.select().from(quizQuestionsAlternatives);

    // Map questions to include their alternatives
    const questionsWithAlternatives = allQuestions.map((q) => ({
      ...q,
      alternatives: allAlternatives.filter((a) => a.questionId === q.id),
    }));

    // Return the quiz with questions and alternatives
    return succeed({
      ...quiz,
      questions: questionsWithAlternatives,
    });
  } catch {
    return fail("Falha ao buscar quiz com questões e alternativas.");
  }
}
