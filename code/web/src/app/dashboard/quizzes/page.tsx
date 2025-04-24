import { unauthorized } from "next/navigation";
import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "~/app/dashboard/quizzes/_components/quiz-card/QuizzesList";
import { Uuid } from "~/lib/types";
import { auth } from "~/server/auth";
import { selectAllQuizzesWithQuestionCount } from "~/server/data/quiz";
import { checkActiveMatchByQuizId } from "~/server/data/match";
import Main from "../_components/Main";
import { CreateQuizModal } from "./_components/CreateQuizModal";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const allQuizzes = await selectAllQuizzesWithQuestionCount();

  const activeMatches = await Promise.all(
    allQuizzes.map(async (quiz) => {
      const match = await checkActiveMatchByQuizId(quiz.id);
      return { quizId: quiz.id, match };
    })
  );

  const activeMatchMap = Object.fromEntries(
    activeMatches.map(({ quizId, match }) => [quizId, match])
  );

  return (
    <Main>
      <div className="flex flex-row justify-between">
        <PageTitle className="mt-1">Meus quizzes</PageTitle>
        <CreateQuizModal educatorId={(session.user.id as Uuid) ?? ""} />
      </div>

      <QuizzesList quizzes={allQuizzes} activeMatches={activeMatchMap} />
    </Main>
  );
}
