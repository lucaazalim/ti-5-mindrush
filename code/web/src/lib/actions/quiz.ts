"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { quizCreateSchema } from "~/app/dashboard/quizzes/form-schema";
import { deleteQuiz, insertQuiz, updateQuiz } from "~/lib/data/quiz";
import { RawQuestionsWithAlternatives, updateQuizParser, uuidParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { type Quiz } from "~/lib/types";
import { ROUTES } from "../constants";
import { generateQuizByPDF, generateQuizByTheme } from "../openai";
import { isUuid, type UpdateQuiz } from "../parsers";
import { createQuestionsAndAlternatives } from "./question";


const quizSchema = z.object({
  educatorId: uuidParser,
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
  type: z.enum(["BLANK", "THEME_GENERATED", "PDF_GENERATED"]),
  theme: z.string().min(3, "O tema deve ter pelo menos 3 caracteres").optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  language: z.string().min(2, "O idioma deve ter pelo menos 2 caracteres").optional(),
  pdfText: z.string().optional(),
});

export async function createQuiz(
  quizData: z.infer<typeof quizCreateSchema>,
): Promise<Result<Quiz, string>> {
  const parsedData = quizSchema.safeParse(quizData);

  if (!parsedData.success) {
    return fail("Os dados informados para a criação do quiz são inválidos.");
  }

  try {
    const quiz = await insertQuiz(parsedData.data);
    let questions;

    if (quizData.type === "THEME_GENERATED") {
      questions = await generateQuizByTheme(quizData);
    } else if (quizData.type === "PDF_GENERATED") {
      questions = await generateQuizByPDF(quizData);
    }

    if (!questions) {
      const rawQuestionsWithAlternatives: RawQuestionsWithAlternatives = {
        quizId: quiz.id,
        ...questions,
      };

      await createQuestionsAndAlternatives(rawQuestionsWithAlternatives);
    }

    revalidatePath(ROUTES.QUIZZES);

    return succeed(quiz);
  } catch (e) {
    return fail(String(e));
  }
}

export async function editQuiz(
  quizId: string,
  updateData: UpdateQuiz,
): Promise<Result<Quiz, string>> {
  if (!isUuid(quizId)) {
    return fail("O ID informado é inválido.");
  }

  if (!updateQuizParser.safeParse(updateData).success) {
    return fail("Os dados informados para a atualização do quiz são inválidos.");
  }

  try {
    const updatedQuiz = await updateQuiz(quizId, updateData);
    return updatedQuiz
      ? succeed(updatedQuiz)
      : fail("O quiz que você está tentando editar não existe.");
  } catch {
    return fail("Falha ao atualizar o quiz.");
  }
}

export async function destroyQuiz(id: string): Promise<Result<void, string>> {
  if (!isUuid(id)) {
    return fail("ID inválido.");
  }

  try {
    return (await deleteQuiz(id))
      ? succeed()
      : fail("O quiz que você está tentando deletar não existe.");
  } catch {
    return fail("Houve um erro ao deletar o quiz.");
  }
}
