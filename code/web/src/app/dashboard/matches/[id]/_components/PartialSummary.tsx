import Container from "~/app/dashboard/_components/Container";
import { useMatchStore } from "../_store/store-provider";
import AnswersChart from "./AnswersChart";
import PartialRanking from "./PartialRanking";

export default function PartialSummary() {
  const match = useMatchStore((state) => state.match);

  if (!match.currentQuestion) {
    throw new Error("No current question");
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Container>
        <AnswersChart />
      </Container>
      <Container>
        <PartialRanking />
      </Container>
    </div>
  );
}
