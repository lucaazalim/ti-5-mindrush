import { useEffect } from "react";
import Main from "~/app/dashboard/_components/Main";
import { isFailure } from "~/lib/result";
import { getUpdatedMatch } from "~/server/actions/match";
import { useMatchStore } from "../_store/store-provider";
import CountdownBar from "./CountdownBar";
import { EndMatchButton } from "./EndMatchButton";
import { NextQuestionButton } from "./NextQuestionButton";
import PartialRanking from "./PartialRanking";
import ParticipantsList from "./ParticipantsList";
import Question from "./Question";

export default function RunningPage() {
  const match = useMatchStore((state) => state.match);
  const setMatch = useMatchStore((state) => state.setMatch);

  const timeLeft = useMatchStore((state) => state.timeLeft);
  const setTimeLeft = useMatchStore((state) => state.setTimeLeft);

  useEffect(() => {
    if (!match.currentQuestionEndsAt || match.currentQuestionEndsAt.getTime() < Date.now()) {
      return;
    }

    const interval = setInterval(() => {
      if (!match.currentQuestionEndsAt) {
        throw new Error("No current question end time.");
      }

      const newTimeLeft = Math.max(0, match.currentQuestionEndsAt.getTime() - Date.now());
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(interval);

        const updateMatch = async () => {
          const result = await getUpdatedMatch(match.id);

          if (isFailure(result)) {
            throw new Error(result.error);
          }

          setMatch(result.data);
        };

        updateMatch().catch(console.error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [match, setMatch, setTimeLeft]);

  return (
    <Main className="flex max-w-full flex-col justify-center gap-5 px-16 py-12">
      {timeLeft !== undefined && timeLeft <= 0 ? (
        <PartialRanking />
      ) : (
        <>
          <Question />
          <CountdownBar />
        </>
      )}
      <div className="grid grid-cols-4 gap-3 rounded-3xl bg-background p-5">
        <ParticipantsList />
        <NextQuestionButton />
        <EndMatchButton />
      </div>
    </Main>
  );
}
