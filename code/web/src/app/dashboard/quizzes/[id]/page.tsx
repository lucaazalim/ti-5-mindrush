import { notFound } from "next/navigation";
import { selectQuizWithQuestionsAndAlternatives } from "~/lib/data/quiz";
import { isUuid } from "~/lib/parsers";
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
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <QuizManualForm quizId={id} initialQuestions={result.questions} />
    </div>
  );
}
