import PageTitle from "~/app/dashboard/_components/PageTitle";
import QuizzesList from "./_components/QuizzesList";
import { getAllQuizzes } from "~/server/quiz";
import CreateQuizButton from "./_components/CreateQuizButton";

export const dynamic = "force-dynamic";

export default async function Page() {
  const quizzes = await getAllQuizzes(); // Fetch no server

  return (
    <div>
      <div className="flex flex-row justify-between">
        <PageTitle>Meus quizzes</PageTitle>
        <CreateQuizButton />
      </div>

      <QuizzesList quizzes={quizzes} />
    </div>
  );
}
