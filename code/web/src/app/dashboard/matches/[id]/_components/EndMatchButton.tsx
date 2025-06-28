import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { endMatch } from "~/lib/actions/match";
import { isFailure } from "~/lib/result";
import { hasNextQuestion } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export function EndMatchButton() {
  const setMatch = useMatchStore((state) => state.setMatch);
  const match = useMatchStore((state) => state.match);

  const mutation = useMutation({
    mutationFn: endMatch,
    onSuccess: (result) => {
      if (isFailure(result)) {
        toast.error(result.error);
        return;
      }

      setMatch(result.data);
      toast("Partida encerrada!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleConfirm() {
    mutation.mutate(match.id);
  }

  return hasNextQuestion(match) ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="grow">
          <CircleX />
          Encerrar partida
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja encerrar a partida?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Student answers will not be saved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} loading={mutation.isPending}>
            End
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Button variant="outline" className="grow" onClick={handleConfirm} loading={mutation.isPending}>
      <CircleX />
      End match
    </Button>
  );
}
