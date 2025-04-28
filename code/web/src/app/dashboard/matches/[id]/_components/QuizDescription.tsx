import Container from "~/app/dashboard/_components/Container";
import { useMatchStore } from "../_store/store-provider";

export default function QuizDescription() {
  const quiz = useMatchStore((state) => state.match.quiz);

  return (
    <Container>
      <h1 className="text-center text-2xl font-bold">{quiz.title}</h1>
      <h2 className="text-center text-lg">{quiz.description}</h2>
    </Container>
  );
}
