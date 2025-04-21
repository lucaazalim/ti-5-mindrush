import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { isFailure } from "~/lib/result";
import { nextQuestion } from "~/server/actions/match";
import { useMatchStore } from "../../_store/store-provider";

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

  const hasNextQuestion = match.currentQuestionId !== match.quiz.questions.at(-1)?.id;

  return (
    <Button onClick={onNextQuestionButtonClicked} disabled={!hasNextQuestion}>
      Próxima questão
    </Button>
  );
}
