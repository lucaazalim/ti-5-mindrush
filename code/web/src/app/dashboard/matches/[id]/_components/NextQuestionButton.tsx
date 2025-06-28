import { useMutation } from "@tanstack/react-query";
import { CircleArrowRight, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { nextQuestion } from "~/lib/actions/match";
import { isFailure } from "~/lib/result";
import { hasCurrentQuestionTimeEnded, hasNextQuestion } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export function NextQuestionButton() {
  const match = useMatchStore((state) => state.match);
  const setMatch = useMatchStore((state) => state.setMatch);

  const mutation = useMutation({
    mutationFn: nextQuestion,
    onSuccess: (result) => {
      if (isFailure(result)) {
        toast.error(result.error);
        return;
      }

      setMatch(result.data);
      toast("You advanced to the next question!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onNextQuestionButtonClicked() {
    mutation.mutate(match.id);
  }

  return (
    <Button
      onClick={onNextQuestionButtonClicked}
      disabled={!hasNextQuestion(match)}
      loading={mutation.isPending}
    >
      {hasCurrentQuestionTimeEnded(match) ? (
        <>
          <CircleArrowRight />
          <span>Next question</span>
        </>
      ) : (
        <>
          <SkipForward />
          <span>Skip question</span>
        </>
      )}
    </Button>
  );
}
