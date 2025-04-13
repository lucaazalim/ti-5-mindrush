import {
  getQuestionsByQuizId,
  getQuizById,
} from "~/server/actions/quiz-actions";
import type { QuizType } from "./_components/QuizManualForm";
import QuizManualForm from "./_components/QuizManualForm";
import { notFound } from "next/navigation";
import { isFailure } from "~/lib/result";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quizResult = await getQuizById(id);

  if (isFailure(quizResult)) {
    return notFound();
  }

  const questionsResult = await getQuestionsByQuizId(id);

  if (isFailure(questionsResult)) {
    return notFound();
  }

  const questions = questionsResult.data.map((q) => {
    const answers = q.alternatives.map((alt: { answer: string }) => alt.answer);
    const correctIndex = q.alternatives.findIndex(
      (alt: { correct: boolean }) => alt.correct,
    );

    return {
      id: q.id,
      question: q.question,
      type: q.type as QuizType,
      createdAt: q.createdAt,
      quizId: q.quizId,
      timeLimit: q.timeLimit,
      answers,
      correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
    };
  });

  return (
    <div className="fixed inset-0 top-[72px] flex w-full bg-muted">
      <QuizManualForm quizId={id} initialQuestions={questions} />
    </div>
  );
}
