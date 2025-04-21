import { Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { isFailure } from "~/lib/result";
import { startMatch } from "~/server/actions/match";
import { useMatchStore } from "../../_store/store-provider";

export function StartMatchButton() {
  const setMatch = useMatchStore((state) => state.setMatch);
  const match = useMatchStore((state) => state.match);

  async function onStartMatchButtonClicked() {
    const result = await startMatch(match.id);

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    setMatch(result.data);
    toast("Partida iniciada!");
  }

  return (
    <Button size="lg" className="grow" onClick={onStartMatchButtonClicked}>
      <Play />
      Iniciar partida
    </Button>
  );
}
