import { z } from "zod";
import { quizCreateSchema, useCreateQuizFormContext } from "~/app/dashboard/quizzes/form-schema";
import { Button } from "~/components/ui/button";

interface StepOneActionsProps {
  setStep: (step: number) => void;
  selectedType: string;
  onSubmit: (values: z.infer<typeof quizCreateSchema>) => void;
}

export default function StepOneActions({ selectedType, setStep, onSubmit }: StepOneActionsProps) {
  const form = useCreateQuizFormContext();

  return (
    <div className="flex justify-center">
      <Button
        type="button"
        className="mt-2 w-1/2"
        onClick={async () => {
          const isValid = await form.trigger(["title", "description"]);

          if (isValid) {
            if (selectedType === "BLANK") {
              await form.handleSubmit(onSubmit)();
            } else {
              setStep(2);
            }
          }
        }}
      >
        {selectedType === "BLANK" ? "Confirmar" : "Continuar ->"}
      </Button>
    </div>
  );
}
