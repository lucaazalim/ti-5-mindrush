"use server";

import { questionAndAlternativesParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { RawQuestionsWithAlternatives } from "~/lib/types";
import { insertQuestionsAndAlternatives } from "../data/question";

export async function createQuestionsAndAlternatives(
  data: RawQuestionsWithAlternatives,
): Promise<Result<void, string>> {
  const parsedData = questionAndAlternativesParser.safeParse(data);

  if (!parsedData.success) {
    return fail(parsedData.error.errors[0]?.message ?? "Os dados informados são inválidos.");
  }

  try {
    await insertQuestionsAndAlternatives(parsedData.data.quizId, parsedData.data);
    return succeed();
  } catch {
    return fail("Houve um problema ao criar as questões.");
  }
}
