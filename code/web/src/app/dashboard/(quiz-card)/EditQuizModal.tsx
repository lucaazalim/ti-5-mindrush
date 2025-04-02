"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { deleteQuiz, updateQuiz } from "~/server/quiz";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import QuizBasicInfos from "../(create-quiz-form)/_components/QuizBasicInfos";

interface EditQuizModalProps {
  open: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  id: string;
  title: string;
  description: string;
}

const editQuizSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(8, "A descrição deve ter pelo menos 8 caracteres"),
});

type EditQuizInput = z.infer<typeof editQuizSchema>;

export default function EditQuizModal({
  open,
  setIsEditDialogOpen,
  id,
  title,
  description,
}: EditQuizModalProps) {
  const editQuizForm = useForm<EditQuizInput>({
    resolver: zodResolver(editQuizSchema),
    mode: "onChange",
    defaultValues: {
      title,
      description,
    },
  });

  async function onSubmit(updateData: EditQuizInput) {
    await updateQuiz(id, updateData);
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar quiz - {title}</DialogTitle>
        </DialogHeader>
        <Form {...editQuizForm}>
          <form
            onSubmit={editQuizForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <QuizBasicInfos
              form={editQuizForm}
              title={title}
              description={description}
            />

            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
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
