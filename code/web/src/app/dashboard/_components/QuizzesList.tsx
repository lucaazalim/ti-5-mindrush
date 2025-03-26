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
      <div className="grid grid-cols-4 gap-5 mt-8">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div className="bg-white p-6 rounded-xl cursor-pointer" key={quiz.id}>
              <h3 className="font-bold">{quiz.title}</h3>
              <p>{quiz.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhum quiz encontrado.</p>
        )}
      </div>
    );
  }