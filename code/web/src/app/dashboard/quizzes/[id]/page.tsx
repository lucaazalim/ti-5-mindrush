import { notFound } from "next/navigation";
import { isUuid } from "~/lib/types";
import { selectQuizWithQuestionsAndAlternatives } from "~/server/data/quiz";
import QuizManualForm from "./_components/QuizManualForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isUuid(id)) {
    return notFound();
  }

  const result = await selectQuizWithQuestionsAndAlternatives(id);

  if (!result) {
    return notFound();
  }

  return (
    <div className="fixed inset-0 top-[72px] flex w-full bg-muted">
      <QuizManualForm quizId={id} initialQuestions={result.questions} />
    </div>
  );
}
