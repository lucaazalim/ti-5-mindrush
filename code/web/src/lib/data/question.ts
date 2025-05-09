import { and, eq, inArray } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import {
  DataAccessOptions,
  NewQuestionAlternative,
  QuestionWithAlternatives,
  RawQuestionsWithAlternatives,
  Uuid,
} from "~/lib/types";
import { auth } from "../auth";
import { db } from "../db";
import { questionAlternatives, questions, quizzes } from "~/lib/db/schema";

export async function insertQuestionsAndAlternatives(
  quizId: Uuid,
  data: RawQuestionsWithAlternatives,
): Promise<void> {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  let nextOrder = 0;

  for (const parsedQuestion of data.questions) {
    const createdQuestion = (
      await db
        .insert(questions)
        .values({
          quizId,
          question: parsedQuestion.question,
          type: parsedQuestion.type,
          timeLimit: parsedQuestion.timeLimit,
          image: parsedQuestion.image ?? null,
          order: nextOrder++,
        })
        .returning()
    )[0];

    if (!createdQuestion) continue;

    const alternatives: NewQuestionAlternative[] = parsedQuestion.alternatives.map(
      (answer, index) => ({
        questionId: createdQuestion.id,
        answer,
        isCorrect: index === parsedQuestion.correctAlternativeIndex,
        order: index,
      }),
    );

    await db.insert(questionAlternatives).values(alternatives);
  }
}

export async function saveQuestionsAndAlternatives(
  quizId: Uuid,
  data: RawQuestionsWithAlternatives,
): Promise<void> {
  const session = await auth();
  if (!session) return unauthorized();

  const existingQuestions = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.quizId, quizId));

  const existingQuestionIds = existingQuestions.map((q) => q.id);

  const incomingQuestionIds = data.questions
    .map((q) => q.id)
    .filter((id): id is Uuid => !!id);

  const toDelete = existingQuestionIds.filter(
    (id) => !incomingQuestionIds.includes(id),
  );

  if (toDelete.length > 0) {
    await db.delete(questionAlternatives).where(
      inArray(questionAlternatives.questionId, toDelete),
    );
    await db.delete(questions).where(inArray(questions.id, toDelete));
  }

  let order = 0;

  for (const q of data.questions) {
    const questionData = {
      question: q.question,
      type: q.type,
      timeLimit: q.timeLimit,
      image: q.image ?? null,
      order: order++,
    };

    if (!q.id || !existingQuestionIds.includes(q.id)) {
      const [createdQuestion] = await db
        .insert(questions)
        .values({ quizId, ...questionData })
        .returning();

      if (!createdQuestion) {
        throw new Error("Erro ao criar questão.");
      }

      const questionId = createdQuestion.id;

      const alternatives: NewQuestionAlternative[] = q.alternatives.map(
        (answer, index) => ({
          questionId,
          answer,
          isCorrect: index === q.correctAlternativeIndex,
          order: index,
        }),
      );

      await db.insert(questionAlternatives).values(alternatives);
    } else {
      const questionId = q.id;

      await db.update(questions)
        .set(questionData)
        .where(eq(questions.id, questionId));

      await db.delete(questionAlternatives).where(
        eq(questionAlternatives.questionId, questionId),
      );

      const alternatives: NewQuestionAlternative[] = q.alternatives.map(
        (answer, index) => ({
          questionId,
          answer,
          isCorrect: index === q.correctAlternativeIndex,
          order: index,
        }),
      );

      await db.insert(questionAlternatives).values(alternatives);
    }
  }
}

export async function selectQuestionWithAlternatives(
  questionId: Uuid,
  { internal = false }: DataAccessOptions = {},
): Promise<QuestionWithAlternatives | undefined> {
  const session = await auth();

  if (!internal && !session) {
    return unauthorized();
  }

  const questionWithQuiz = (
    await db
      .select()
      .from(questions)
      .innerJoin(quizzes, eq(questions.quizId, quizzes.id))
      .where(
        internal
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
