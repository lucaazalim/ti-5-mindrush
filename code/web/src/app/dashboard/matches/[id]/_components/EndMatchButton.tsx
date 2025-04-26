import { DialogClose } from "@radix-ui/react-dialog";
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
import { isFailure } from "~/lib/result";
import { endMatch } from "~/server/actions/match";
import { useMatchStore } from "../_store/store-provider";

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
    <>
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
              Esta ação não pode ser desfeita. As respostas dos estudantes não serão salvas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={onEndMatchButtonClicked}>
              Encerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
