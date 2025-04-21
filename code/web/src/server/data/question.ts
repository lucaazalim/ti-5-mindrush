import { NewQuestionAlternative, RawQuestionsWithAlternatives, Uuid } from "~/lib/types";
import { db } from "../db";
import { questionAlternatives, questions } from "../db/schema";

export async function insertQuestionsAndAlternatives(
  quizId: Uuid,
  data: RawQuestionsWithAlternatives,
): Promise<void> {
  for (const parsedQuestion of data.questions) {
    const createdQuestion = (
      await db
        .insert(questions)
        .values({
          quizId,
          question: parsedQuestion.question,
          type: parsedQuestion.type,
          timeLimit: 20,
        })
        .returning()
    )[0];

    if (!createdQuestion) continue;

    const alternatives: NewQuestionAlternative[] = parsedQuestion.alternatives.map(
      (answer, index) => ({
        questionId: createdQuestion.id,
        answer,
        correct: index === parsedQuestion.correctAlternativeIndex,
      }),
    );

    await db.insert(questionAlternatives).values(alternatives);
  }
}
