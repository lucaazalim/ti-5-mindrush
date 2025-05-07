import Container from "~/app/dashboard/_components/Container";
import { useMatchStore } from "../_store/store-provider";

export default function QuizDescription() {
  const quiz = useMatchStore((state) => state.match.quiz);

  return (
    <Container className="bg-primary text-center text-white">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <h2 className="text-lg">{quiz.description}</h2>
    </Container>
  );
}
