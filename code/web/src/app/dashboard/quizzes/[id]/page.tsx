import { getQuestionsByQuizId, getQuizById } from "~/server/actions/quiz-actions";
import type { QuizType } from "./_components/QuizManualForm";
import { QuizManualForm } from "./_components/QuizManualForm";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const quiz = await getQuizById(id);

  const questionsFromDb = await getQuestionsByQuizId(id);
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
