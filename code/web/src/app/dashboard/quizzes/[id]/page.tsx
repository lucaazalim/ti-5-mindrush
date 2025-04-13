import { getQuizWithQuestionsAndAlternatives } from "~/server/actions/quiz-actions";
import QuizManualForm from "./_components/QuizManualForm";
import { notFound } from "next/navigation";
import { isFailure } from "~/lib/result";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getQuizWithQuestionsAndAlternatives(id);

  if (isFailure(result)) {
    return notFound();
  }

  return (
    <div className="fixed inset-0 top-[72px] flex w-full bg-muted">
      <QuizManualForm quizId={id} initialQuestions={result.data.questions} />
    </div>
  );
}
