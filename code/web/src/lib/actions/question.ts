"use server";

import { saveQuestionsAndAlternatives } from "~/lib/data/question";
import { quizWithQuestionsAndAlternativesParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { RawQuestionsWithAlternatives } from "../parsers";

export async function createQuestionsAndAlternatives(
  data: RawQuestionsWithAlternatives,
): Promise<Result<void, string>> {
  const parsedData = quizWithQuestionsAndAlternativesParser.safeParse(data);

  if (!parsedData.success) {
    return fail(parsedData.error.errors[0]?.message ?? "Os dados informados são inválidos.");
  }

  try {
    await saveQuestionsAndAlternatives(parsedData.data.quizId, parsedData.data);
    return succeed();
  } catch (e) {
    console.error(e);
    return fail("Houve um problema ao salvar as questões.");
  }
}
