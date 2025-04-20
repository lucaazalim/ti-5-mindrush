import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "~/app/dashboard/quizzes/_components/quiz-card/QuizzesList";
import { auth } from "~/server/auth";
import { selectAllQuizzesWithQuestionCount } from "~/server/data/quiz";
import { CreateQuizModal } from "./_components/CreateQuizModal";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  const allQuizzes = await selectAllQuizzesWithQuestionCount();

  return (
    <div>
      <div className="flex flex-row justify-between">
        <PageTitle className="mt-1">Meus quizzes</PageTitle>
        <CreateQuizModal educatorId={session?.user?.id ?? ""} />
      </div>

      <QuizzesList quizzes={allQuizzes} />
    </div>
  );
}
