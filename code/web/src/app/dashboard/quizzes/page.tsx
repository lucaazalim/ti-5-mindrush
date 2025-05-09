import { unauthorized } from "next/navigation";
import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "~/app/dashboard/quizzes/_components/quiz-card/QuizzesList";
import { Uuid } from "~/lib/types";
import { auth } from "src/lib/auth";
import { selectAllQuizzesWithQuestionCountAndActiveMatch } from "~/lib/data/quiz";
import Main from "../_components/Main";
import { CreateQuizModal } from "./_components/CreateQuizModal";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const allQuizzes = await selectAllQuizzesWithQuestionCountAndActiveMatch();

  return (
    <Main>
      <div className="flex flex-row justify-between">
        <PageTitle className="mt-1">Seus quizzes</PageTitle>
        <CreateQuizModal educatorId={(session.user.id as Uuid) ?? ""} />
      </div>

      <QuizzesList quizzes={allQuizzes} />
    </Main>
  );
}
