import { and, eq } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import {
  NewQuestionAlternative,
  QuestionWithAlternatives,
  RawQuestionsWithAlternatives,
  Uuid,
} from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { questionAlternatives, questions, quizzes } from "../db/schema";
import { DataAccessOptions } from "./types";

export async function insertQuestionsAndAlternatives(
  quizId: Uuid,
  data: RawQuestionsWithAlternatives,
): Promise<void> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  // TODO should this insert new questions every time? What about updating the questions and alternatives?
  // TODO authorization (only the owner of the quiz can create new questions and alternatives, for example)
  // TODO optimize to one or two queries, as queries inside for loops is a bad idea. Learn about "batch insert".

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

export async function selectQuestionWithAlternatives(
  questionId: Uuid,
  options?: DataAccessOptions,
): Promise<QuestionWithAlternatives | undefined> {
  const session = await auth();

  if (!options?.internal && !session) {
    return unauthorized();
  }

  const questionWithQuiz = (
    await db
      .select()
      .from(questions)
      .innerJoin(quizzes, eq(questions.quizId, quizzes.id))
      .where(
        options?.internal
          ? eq(questions.id, questionId)
          : and(eq(questions.id, questionId), eq(quizzes.educatorId, session!.user.id as Uuid)),
      )
      .orderBy(questions.order)
  )[0];

  if (!questionWithQuiz) {
    return undefined;
  }

  const { question } = questionWithQuiz;

  const alternatives = await db
    .select()
    .from(questionAlternatives)
    .where(eq(questionAlternatives.questionId, questionId))
    .orderBy(questionAlternatives.order);

  return {
    ...question,
    alternatives,
  };
}
