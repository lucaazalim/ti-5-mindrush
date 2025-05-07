import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { destroyQuiz } from "~/server/actions/quiz";

interface DeleteQuizModalProps {
  open: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  id: string;
  title: string;
}

export default function DeleteQuizModal({
  open,
  setIsDeleteDialogOpen,
  id,
  title,
}: DeleteQuizModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir quiz - {title}</DialogTitle>
          <DialogDescription>Esta ação excluirá permanentemente o quiz.</DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await destroyQuiz(id);
              toast.success("Quiz excluído com sucesso!");
              router.refresh();
            }}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
