import { Progress } from "~/components/ui/progress";
import { hasCurrentQuestion } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export default function CountdownBar() {
  const match = useMatchStore((state) => state.match);
  const timeLeft = useMatchStore((state) => state.timeLeft);

  if (!hasCurrentQuestion(match)) {
    return;
  }

  const { currentQuestionEndsAt, currentQuestionStartedAt } = match;

  const timeLimit = currentQuestionEndsAt.getTime() - currentQuestionStartedAt.getTime();
  const progress = timeLeft === undefined ? 100 : (timeLeft / timeLimit) * 100;

  return <Progress value={progress} className="h-8" />;
}
