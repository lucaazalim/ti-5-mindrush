import { CircleArrowRight, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { isFailure } from "~/lib/result";
import { hasCurrentQuestionTimeEnded, hasNextQuestion } from "~/lib/utils";
import { nextQuestion } from "~/server/actions/match";
import { useMatchStore } from "../_store/store-provider";

export function NextQuestionButton() {
  const match = useMatchStore((state) => state.match);
  const setMatch = useMatchStore((state) => state.setMatch);

  async function onNextQuestionButtonClicked() {
    const result = await nextQuestion(match.id);

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    setMatch(result.data);
    toast("Você avançou para a próxima questão!");
  }

  return (
    <Button onClick={onNextQuestionButtonClicked} disabled={!hasNextQuestion(match)}>
      {hasCurrentQuestionTimeEnded(match) ? (
        <>
          <CircleArrowRight />
          <span>Próxima questão</span>
        </>
      ) : (
        <>
          <SkipForward />
          <span>Pular questão</span>
        </>
      )}
    </Button>
  );
}
