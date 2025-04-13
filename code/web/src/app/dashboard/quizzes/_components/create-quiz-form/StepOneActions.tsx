"use client";

import { Button } from "~/components/ui/button";
import {
  type CreateQuizSchema,
  useCreateQuizFormContext,
} from "~/app/dashboard/quizzes/form-schema";

interface StepOneActionsProps {
  setStep: (step: number) => void;
  selectedType: string;
  onSubmit: (values: CreateQuizSchema) => Promise<void>;
}

export default function StepOneActions({
  selectedType,
  setStep,
  onSubmit,
}: StepOneActionsProps) {
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
        {selectedType === "BLANK" ? "Criar Quiz" : "Continuar ->"}
      </Button>
    </div>
  );
}
