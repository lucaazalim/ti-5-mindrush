"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/lib/constants";
import { isFailure } from "~/lib/result";
import type { QuizWithQuestionCountAndActiveMatch, Uuid } from "~/lib/types";
import { createMatch } from "~/server/actions/match";
import QuizOptions from "./QuizOptions";

interface QuizzesListProps {
  quizzes: QuizWithQuestionCountAndActiveMatch[];
}

export default function QuizzesList({ quizzes }: QuizzesListProps) {
  const router = useRouter();

  const newMatch = async (quizId: Uuid) => {
    const result = await createMatch(quizId);

    if (isFailure(result)) {
      toast.error("Erro ao criar partida: " + result.error);
      return;
    }

    toast.success("Partida criada com sucesso!");
    router.push(ROUTES.MATCH(result.data.id));
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          const activeMatch = quiz.activeMatch;

          return (
            <div
              key={quiz.id}
              onClick={() => router.push(ROUTES.QUIZ(quiz.id))}
              className="flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md dark:bg-zinc-900 dark:shadow"
            >
              <div className="relative flex h-32 items-center justify-center bg-gray-200 dark:bg-zinc-800">
                {activeMatch ? (
                  <Button
                    className="mt-4 h-11"
                    onClick={() => router.push(ROUTES.MATCH(activeMatch.id))}
                  >
                    Acompanhar partida
                  </Button>
                ) : (
                  <Button className="mt-4 h-11" onClick={() => newMatch(quiz.id)}>
                    Criar Partida
                  </Button>
                )}

                <span className="absolute right-2 top-2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                  {quiz.questionCount} {quiz.questionCount === 1 ? "questão" : "questões"}
                </span>
              </div>

              <div className="relative flex flex-1 flex-col justify-between px-4 py-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                </div>

                <QuizOptions quiz={quiz} />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-muted-foreground">Nenhum quiz encontrado.</p>
      )}
    </div>
  );
}
