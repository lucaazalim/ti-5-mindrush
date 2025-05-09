import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { Quiz, UpdateQuiz } from "~/lib/types";
import { editQuiz } from "~/lib/actions/quiz";
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

  const renameQuizForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: quiz.title,
      description: quiz.description,
    },
  });

  async function onSubmit(updateData: UpdateQuiz) {
    await editQuiz(quiz.id, updateData);
    toast.info("Quiz renomeado com sucesso!");
    router.refresh();
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
              <Button>Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
