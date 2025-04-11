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
import { UpdateQuiz } from "~/lib/types";
import { uuidParser } from "~/lib/parsers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RenameQuizModalProps {
  open: boolean;
  setIsRenameDialogOpen: (open: boolean) => void;
  quizInput: UpdateQuiz;
}

const renameQuizSchema = z.object({
  id: uuidParser,
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(8, "A descrição deve ter pelo menos 8 caracteres"),
});

export default function RenameQuizModal({ open, setIsRenameDialogOpen, quizInput }: RenameQuizModalProps) {

  const router = useRouter();

  const renameQuizForm = useForm<UpdateQuiz>({
    resolver: zodResolver(renameQuizSchema),
    mode: "onChange",
    defaultValues: {
      id: quizInput.id,
      title: quizInput.title,
      description : quizInput.description,
    },
  });

  async function onSubmit(updateData: UpdateQuiz) {
    await updateQuiz(updateData);
    toast.info("Quiz renomeado com sucesso!");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar quiz - {quizInput.title}</DialogTitle>
        </DialogHeader>
        <Form {...renameQuizForm}>
          <form
            onSubmit={renameQuizForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <QuizBasicInfo />

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
