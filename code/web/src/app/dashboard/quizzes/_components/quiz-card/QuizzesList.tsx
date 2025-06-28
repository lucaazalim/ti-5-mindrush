import type { QuizWithQuestionCountAndActiveMatch } from "~/lib/types";
import CreateOrTrackMatchButton from "./CreateOrTrackMatchButton";
import QuizOptions from "./QuizOptions";

interface QuizzesListProps {
  quizzes: QuizWithQuestionCountAndActiveMatch[];
}

export default function QuizzesList({ quizzes }: QuizzesListProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          return (
            <div
              key={quiz.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md dark:bg-zinc-900 dark:shadow"
            >
              <div className="relative flex h-32 items-center justify-center bg-gray-200 dark:bg-zinc-800">
                <CreateOrTrackMatchButton quiz={quiz} />
                <span className="absolute right-2 top-2 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground">
                  {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
                </span>
              </div>

              <div className="relative flex flex-1 flex-col justify-between px-4 py-5">
                <div className="space-y-1">
                  <h3 className="break-words pr-8 text-sm font-semibold">{quiz.title}</h3>
                  <p className="line-clamp-2 break-words text-sm text-muted-foreground">
                    {quiz.description}
                  </p>
                </div>

                <QuizOptions quiz={quiz} />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-muted-foreground">No quiz found.</p>
      )}
    </div>
  );
}
