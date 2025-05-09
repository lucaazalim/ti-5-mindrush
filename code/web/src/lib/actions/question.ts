"use server";

import { questionAndAlternativesParser } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { RawQuestionsWithAlternatives } from "~/lib/types";
import { saveQuestionsAndAlternatives } from "~/lib/data/question";

export async function createQuestionsAndAlternatives(
  data: RawQuestionsWithAlternatives,
): Promise<Result<void, string>> {
  const parsedData = questionAndAlternativesParser.safeParse(data);

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
