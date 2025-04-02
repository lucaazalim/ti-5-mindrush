import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "./(quiz-card)/QuizzesList";
import { getAllQuizzes } from "~/server/quiz";
import { CreateQuizModal } from "./(create-quiz-form)/CreateQuizModal";
import { auth } from "~/server/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const dataAuth = await auth();
  const quizzes = await getAllQuizzes();

  return (
    <div>
      <div className="flex flex-row justify-between">
        <PageTitle className="mt-1">Meus quizzes</PageTitle>
        <CreateQuizModal educatorId={dataAuth?.user?.id ?? ""} />
      </div>

      <QuizzesList quizzes={quizzes} />
    </div>
  );
}
