import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { useMatchStore } from "../../_store/store-provider";

export default function CountdownBar() {
  const match = useMatchStore((state) => state.match);
  const [timeLeft, setTimeLeft] = useState<number | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!match.currentQuestion || !match.currentQuestionEndsAt) {
        console.error("No current question or question end time.");
        return;
      }

      const timeLeft = Math.max(0, match.currentQuestionEndsAt.getTime() - new Date().getTime());

      setTimeLeft(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [match]);

  const { currentQuestion, currentQuestionStartedAt, currentQuestionEndsAt } = match;

  if (!currentQuestion || !currentQuestionStartedAt || !currentQuestionEndsAt) {
    return;
  }

  const timeLimit = currentQuestionEndsAt.getTime() - currentQuestionStartedAt.getTime();
  const progress = timeLeft === undefined ? 100 : (timeLeft / timeLimit) * 100;

  return <Progress value={progress} className="h-10" />;
}
