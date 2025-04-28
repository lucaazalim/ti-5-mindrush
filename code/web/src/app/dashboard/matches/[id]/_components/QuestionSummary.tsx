import Container from "~/app/dashboard/_components/Container";
import { hasNextQuestion } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";
import AnswersChart from "./AnswersChart";
import ListLeaderboard from "./ListLeaderboard";

export default function QuestionSummary() {
  const match = useMatchStore((state) => state.match);

  if (!match.currentQuestion) {
    throw new Error("No current question");
  }

  return (
    <>
      <Container>
        <h1 className="p-5 text-center text-5xl font-medium drop-shadow-md">
          {match.currentQuestion.question}
        </h1>
      </Container>
      {hasNextQuestion(match) ? (
        <div className="grid grid-cols-2 gap-5">
          <AnswersChart />
          <ListLeaderboard />
        </div>
      ) : (
        <AnswersChart />
      )}
    </>
  );
}
