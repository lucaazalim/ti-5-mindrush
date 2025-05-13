import { notFound } from "next/navigation";
import { selectQuizWithQuestionsAndAlternatives } from "~/lib/data/quiz";
import { isUuid } from "~/lib/parsers";
import QuizForm from "./_components/QuizForm";

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
      <QuizForm quizId={id} initialQuestions={result.questions} />
    </div>
  );
}
