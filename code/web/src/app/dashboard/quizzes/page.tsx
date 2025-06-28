import Link from "next/link";
import { unauthorized } from "next/navigation";
import { auth } from "src/lib/auth";
import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "~/app/dashboard/quizzes/_components/quiz-card/QuizzesList";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/lib/constants";
import { selectAllQuizzesWithQuestionCountAndActiveMatch } from "~/lib/data/quiz";
import { Uuid } from "~/lib/parsers";
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
        <PageTitle className="mt-1">Your quizzes</PageTitle>
        <div className="flex flex-row items-center gap-3">
          <Link href={ROUTES.MATCHES}>
            <Button variant="outline">Match History</Button>
          </Link>
          <CreateQuizModal educatorId={(session.user.id as Uuid) ?? ""} />
        </div>
      </div>

      <QuizzesList quizzes={allQuizzes} />
    </Main>
  );
}
