"use client";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { deleteQuiz } from "~/server/actions/quiz-actions";

interface DeleteQuizModalProps {
  open: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  id: string;
  title: string;
}

export default function DeleteQuizModal({ open, setIsDeleteDialogOpen, id, title }: DeleteQuizModalProps) {
  return (
    <Dialog open={open} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir quiz - {title}</DialogTitle>
          <DialogDescription>
            Esta ação excluirá permanentemente o quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteQuiz(id);
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
