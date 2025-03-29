"use client";

import Link from "next/link";
import QuizOptions from "./QuizOptions";

interface Quiz {
  id: string;
  educatorId: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface QuizzesListProps {
  quizzes: Quiz[];
}

export default function QuizzesList({ quizzes }: QuizzesListProps) {
  return (
    <div className="mt-8 grid grid-cols-4 gap-5">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="relative cursor-pointer rounded-xl bg-white p-6"
          >
            <Link href={`/quiz/${quiz.id}`} prefetch={true}>
              <div className="relative flex flex-row justify-between">
                <h3 className="font-bold">{quiz.title}</h3>
              </div>
              <p>{quiz.description}</p>
            </Link>

            <QuizOptions quizId={quiz.id} />
          </div>
        ))
      ) : (
        <p className="text-gray-500">Nenhum quiz encontrado.</p>
      )}
    </div>
  );
}
