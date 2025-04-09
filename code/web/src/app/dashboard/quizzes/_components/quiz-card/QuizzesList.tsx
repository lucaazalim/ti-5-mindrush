"use client";

import Link from "next/link";
import QuizOptions from "./QuizOptions";
import { Button } from "~/components/ui/button";
import type { Quiz } from "~/lib/types";
import {useRouter} from "next/navigation";
import {ROUTES} from "~/lib/constants";
import {createMatch} from "~/server/actions/match-actions";
import {isFailure} from "~/lib/result";

interface QuizzesListProps {
  quizzes: Quiz[];
}

export default function QuizzesList({ quizzes }: QuizzesListProps) {

  const router = useRouter();

  const newMatch = async (quizId: string) => {
    console.log("id", quizId);
    const result = await createMatch(quizId);
    if (isFailure(result)) {
      alert(result.error.message);
      return;
    }

    const id = result.data.id;
    router.push(ROUTES.MATCH(id));

  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative flex h-32 items-center justify-center bg-gray-200">
              <Button
                className="mt-4 h-11"
                onClick={() => newMatch(quiz.id)}
              >
                Criar Partida
              </Button>

              <span className="absolute right-2 top-2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                {quiz.questionCount}{" "}
                {quiz.questionCount === 1 ? "pergunta" : "perguntas"}
              </span>
            </div>

            <div className="relative flex flex-1 flex-col justify-between px-4 py-5">
              <Link href={`/src/app/dashboard/matches/${quiz.id}`}>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {quiz.description}
                  </p>
                </div>
              </Link>

              <QuizOptions
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">Nenhum quiz encontrado.</p>
      )}
    </div>
  );
}
