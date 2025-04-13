import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "~/app/dashboard/quizzes/_components/quiz-card/QuizzesList";
import { getAllQuizzes } from "~/server/actions/quiz-actions";
import { CreateQuizModal } from "./_components/CreateQuizModal";
import { auth } from "~/server/auth";
import { isFailure } from "~/lib/result";

export const dynamic = "force-dynamic";

export default async function Page() {
  const dataAuth = await auth();
  const quizzesResult = await getAllQuizzes();

  if (isFailure(quizzesResult)) {
    return <div>Falha ao carregar quizzes.</div>;
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <PageTitle className="mt-1">Meus quizzes</PageTitle>
        <CreateQuizModal educatorId={dataAuth?.user?.id ?? ""} />
      </div>

      <QuizzesList quizzes={quizzesResult.data} />
    </div>
  );
}
