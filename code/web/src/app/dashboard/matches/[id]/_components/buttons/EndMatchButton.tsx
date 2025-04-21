import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { isFailure } from "~/lib/result";
import { endMatch } from "~/server/actions/match";
import { useMatchStore } from "../../_store/store-provider";

export function EndMatchButton() {
  const setMatch = useMatchStore((state) => state.setMatch);
  const match = useMatchStore((state) => state.match);

  async function onEndMatchButtonClicked() {
    const result = await endMatch(match.id);

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    setMatch({ ...match, ...result.data });
    toast("Partida encerrada!");
  }

  return (
    <Button variant="outline" size="lg" className="grow" onClick={onEndMatchButtonClicked}>
      <CircleX />
      Encerrar partida
    </Button>
  );
}
