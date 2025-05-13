import { useMutation } from "@tanstack/react-query";
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
import { destroyQuiz } from "~/lib/actions/quiz";
import { isFailure } from "~/lib/result";
import { Quiz } from "~/lib/types";

interface DeleteQuizModalProps {
  open: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  quiz: Quiz;
}

export default function DeleteQuizModal({
  open,
  setIsDeleteDialogOpen,
  quiz,
}: DeleteQuizModalProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await destroyQuiz(quiz.id);
      if (isFailure(result)) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      toast.success("Quiz excluído com sucesso!");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Erro ao excluir quiz: " + error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir quiz - {quiz.title}</DialogTitle>
          <DialogDescription>Esta ação excluirá permanentemente o quiz.</DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
