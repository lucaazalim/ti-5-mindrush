import { useMutation } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { isFailure } from "~/lib/result";
import { startMatch } from "~/server/actions/match";
import { useMatchStore } from "../_store/store-provider";

export function StartMatchButton() {
  const setMatch = useMatchStore((state) => state.setMatch);
  const match = useMatchStore((state) => state.match);

  const mutation = useMutation({
    mutationFn: startMatch,
    onSuccess: (result) => {
      if (isFailure(result)) {
        toast.error(result.error);
        return;
      }

      setMatch(result.data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onStartMatchButtonClicked() {
    mutation.mutate(match.id);
  }

  return (
    <Button className="grow" onClick={onStartMatchButtonClicked} loading={mutation.isPending}>
      <Play />
      Iniciar partida
    </Button>
  );
}
