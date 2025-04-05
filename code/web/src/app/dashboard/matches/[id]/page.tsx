import { getQuizById, getQuestionsByQuizId } from "~/server/actions/quiz-actions";

interface PageProps {
  params: { id: string };
}

type Alternative = {
  id: string;
  answer: string;
  correct: boolean;
};

export default async function QuizDetailPage({ params }: PageProps) {
  const quizId = params.id;

  const [quiz, questions] = await Promise.all([
    getQuizById(quizId),
    getQuestionsByQuizId(quizId),
  ]);

  if (!quiz) {
    return <div className="p-10 text-red-500">Quiz não encontrado.</div>;
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-2 text-2xl font-bold">{quiz.title}</h1>
      <p className="mb-6 text-muted-foreground">{quiz.description}</p>

      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma pergunta cadastrada ainda.
        </p>
      ) : (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <h2 className="mb-2 font-semibold">
                {i + 1}. {q.question}
              </h2>

              <ul className="space-y-2">
                {(q.alternatives as Alternative[]).map((alt, idx) => (
                  <li
                    key={alt.id}
                    className={`rounded px-3 py-1 text-sm ${
                      alt.correct
                        ? "bg-green-100 font-semibold text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}. {alt.answer}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
