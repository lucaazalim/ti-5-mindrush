import { getQuizById, getQuestionsByQuizId } from "~/server/quiz";
import { QuizManualForm } from "./QuizManualForm";
import type { QuizType } from "./QuizManualForm"; // importa o tipo correto

export default async function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const quiz = await getQuizById(searchParams.id);
  const questionsFromDb = await getQuestionsByQuizId(searchParams.id);

  if (!quiz) {
    return <div className="p-4 text-red-500">Quiz não encontrado.</div>;
  }

  const questions = questionsFromDb.map((q) => ({
    id: q.id,
    question: q.question,
    type: q.type as QuizType,
    alternatives: q.alternatives.map((alt) => ({
      answer: alt.answer,
      correct: alt.correct,
    })),
  }));

  return (
    <div className="fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full bg-muted">
      <QuizManualForm quiz={quiz} initialQuestions={questions} />
    </div>
  );
}
