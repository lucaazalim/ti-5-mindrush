import { useEffect } from "react";
import Container from "~/app/dashboard/_components/Container";
import Main from "~/app/dashboard/_components/Main";
import { getUpdatedMatch } from "~/lib/actions/match";
import { isFailure } from "~/lib/result";
import {
  getCurrentQuestionTimeLeft,
  hasCurrentQuestion,
  hasCurrentQuestionTimeEnded,
} from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";
import CountdownBar from "./CountdownBar";
import { EndMatchButton } from "./EndMatchButton";
import { NextQuestionButton } from "./NextQuestionButton";
import ParticipantList from "./ParticipantList";
import Question from "./Question";
import QuestionSummary from "./QuestionSummary";

export default function RunningPage() {
  const match = useMatchStore((state) => state.match);
  const setMatch = useMatchStore((state) => state.setMatch);
  const setTimeLeft = useMatchStore((state) => state.setTimeLeft);

  useEffect(() => {
    if (hasCurrentQuestionTimeEnded(match)) {
      return;
    }

    const interval = setInterval(() => {
      if (!hasCurrentQuestion(match)) {
        throw new Error("No current question end time.");
      }

      const newTimeLeft = getCurrentQuestionTimeLeft(match);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0) return;

      clearInterval(interval);

      getUpdatedMatch(match.id)
        .then((result) => {
          if (isFailure(result)) {
            throw new Error(result.error);
          }

          setMatch(result.data);
        })
        .catch(console.error);
    }, 100);

    return () => clearInterval(interval);
  }, [match, setMatch, setTimeLeft]);

  return (
    <Main className="flex max-w-full flex-col justify-center gap-5 p-5 md:p-14">
      {hasCurrentQuestionTimeEnded(match) ? (
        <QuestionSummary />
      ) : (
        <>
          <Question />
          <CountdownBar />
        </>
      )}
      <Container className="flex flex-col gap-3 md:grid md:grid-cols-4">
        <ParticipantList />
        <NextQuestionButton />
        <EndMatchButton />
      </Container>
    </Main>
  );
}
