"use client";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { deleteQuiz } from "~/server/quiz";

interface DeleteQuizModalProps {
  open: boolean;
  setIsDialogOpen: (open: boolean) => void;
  quizId: string;
}

export default function DeleteQuizModal({
  open,
  setIsDialogOpen,
  quizId,
}: DeleteQuizModalProps) {
  return (
    <Dialog open={open} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir quiz</DialogTitle>
          <DialogDescription>
            Esta a excluirá permanentemente este quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteQuiz(quizId);
              window.location.reload();
            }}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
