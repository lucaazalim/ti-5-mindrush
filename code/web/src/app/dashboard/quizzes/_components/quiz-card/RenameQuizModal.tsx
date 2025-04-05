"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { updateQuiz } from "~/server/actions/quiz-actions";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import QuizBasicInfo from "../create-quiz-form/QuizBasicInfo";

interface RenameQuizModalProps {
  open: boolean;
  setIsRenameDialogOpen: (open: boolean) => void;
  id: string;
  title: string;
  description: string;
}

const renameQuizSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(8, "A descrição deve ter pelo menos 8 caracteres"),
});

type RenameQuizInput = z.infer<typeof renameQuizSchema>;

export default function RenameQuizModal({
  open,
  setIsRenameDialogOpen,
  id,
  title,
  description,
}: RenameQuizModalProps) {
  const renameQuizForm = useForm<RenameQuizInput>({
    resolver: zodResolver(renameQuizSchema),
    mode: "onChange",
    defaultValues: {
      title,
      description,
    },
  });

  async function onSubmit(updateData: RenameQuizInput) {
    await updateQuiz(id, updateData);
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar quiz - {title}</DialogTitle>
        </DialogHeader>
        <Form {...renameQuizForm}>
          <form
            onSubmit={renameQuizForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <QuizBasicInfo
              formContext={renameQuizForm}
              title={title}
              description={description}
            />

            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button>Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
