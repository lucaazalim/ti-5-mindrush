import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { editQuiz } from "~/lib/actions/quiz";
import { UpdateQuiz } from "~/lib/parsers";
import { isFailure } from "~/lib/result";
import { Quiz } from "~/lib/types";
import QuizBasicInfo from "../create-quiz-form/QuizBasicInfo";

type Props = {
  quiz: Quiz;
  open: boolean;
  setIsRenameDialogOpen: (open: boolean) => void;
};

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
});

export default function RenameQuizModal({ open, setIsRenameDialogOpen, quiz }: Props) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (updateData: UpdateQuiz) => {
      const result = await editQuiz(quiz.id, updateData);
      if (isFailure(result)) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      toast.success("Quiz renomeado com sucesso!");
      setIsRenameDialogOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Erro ao renomear quiz: " + error.message);
    },
  });

  const renameQuizForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: quiz.title,
      description: quiz.description,
    },
  });

  function onSubmit(updateData: UpdateQuiz) {
    mutation.mutate(updateData);
  }

  return (
    <Dialog open={open} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar quiz - {quiz.title}</DialogTitle>
        </DialogHeader>
        <Form {...renameQuizForm}>
          <form onSubmit={renameQuizForm.handleSubmit(onSubmit)} className="space-y-6">
            <QuizBasicInfo />

            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancelar
              </Button>
              <Button loading={mutation.isPending}>Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
