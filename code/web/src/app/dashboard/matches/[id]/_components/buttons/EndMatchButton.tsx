import { CircleX } from "lucide-react";
import { useState } from "react";
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
import { useMatchStore } from "../../_store/store-provider";

export function EndMatchButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(false);
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onEndMatchButtonClicked}>
              Encerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
