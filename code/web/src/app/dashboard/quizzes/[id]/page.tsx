import {
  getQuestionsByQuizId,
  getQuizById,
} from "~/server/actions/quiz-actions";
import type { QuizType } from "./_components/QuizManualForm";
import QuizManualForm from "./_components/QuizManualForm";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const quizResult = await getQuizById(id);
  if (!quizResult || typeof quizResult !== "object" || "error" in quizResult) {
    return <div className="p-4 text-red-500">Quiz não encontrado.</div>;
  }

  const questionsFromDb = await getQuestionsByQuizId(id);

  const questions = questionsFromDb.map((q) => {
    const answers = q.alternatives.map((alt) => alt.answer);
    const correctIndex = q.alternatives.findIndex((alt) => alt.correct);

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
    <div className="fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full bg-muted">
      <QuizManualForm quizId={id} initialQuestions={questions} />
    </div>
  );
}
