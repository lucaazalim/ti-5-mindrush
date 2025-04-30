import { Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useSound } from "~/lib/hooks";
import { isFailure } from "~/lib/result";
import { startMatch } from "~/server/actions/match";
import { useMatchStore } from "../_store/store-provider";

export function StartMatchButton() {
  const setMatch = useMatchStore((state) => state.setMatch);
  const match = useMatchStore((state) => state.match);
  const startSound = useSound("start.mp3");

  async function onStartMatchButtonClicked() {
    const result = await startMatch(match.id);

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    setMatch(result.data);
    startSound();
  }

  return (
    <Button className="grow" onClick={onStartMatchButtonClicked}>
      <Play />
      Iniciar partida
    </Button>
  );
}
