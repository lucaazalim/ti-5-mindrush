"use server";

import { z } from "zod";
import { quizCreateSchema } from "~/app/dashboard/quizzes/form-schema";
import { updateQuizParser, uuidParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { isUuid, type Quiz, type UpdateQuiz } from "~/lib/types";
import { generateQuizByTheme } from "../../lib/openai";
import { deleteQuiz, insertQuiz, updateQuiz } from "../data/quiz";
import { createQuestionsAndAlternatives } from "./question";

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

export async function createQuiz(
  quizData: z.infer<typeof quizCreateSchema>,
): Promise<Result<Quiz, string>> {
  const parsedData = quizSchema.safeParse(quizData);

  if (!parsedData.success) {
    return fail("Os dados informados para a criação do quiz são inválidos.");
  }

  try {
    const quiz = await insertQuiz(parsedData.data);

    if (quizData.type === "THEME_GENERATED") {
      const questions = await generateQuizByTheme(quizData);

      const rawQuestionsWithAlternatives = {
        quizId: quiz.id,
        ...questions,
      };

      await createQuestionsAndAlternatives(rawQuestionsWithAlternatives);
    }

    return succeed(quiz);
  } catch (e) {
    console.error(e);
    return fail("Falha ao criar o quiz.");
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
