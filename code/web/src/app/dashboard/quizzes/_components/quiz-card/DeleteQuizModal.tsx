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
      toast.success("Quiz deleted successfully!");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error deleting quiz: " + error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete quiz - {quiz.title}</DialogTitle>
          <DialogDescription>This action will permanently delete the quiz.</DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
