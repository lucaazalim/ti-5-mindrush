"use client";

import { Button } from "~/components/ui/button";
import { useCreateQuizFormContext } from "~/app/dashboard/quizzes/form-schema";

interface StepOneActionsProps {
  setStep: (step: number) => void;
  selectedType: string;
  onSubmit: (values: {
    educatorId: string;
    title: string;
    description: string;
    type: "BLANK" | "AI_GENERATED" | "PDF_GENERATED";
    theme?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    language?: string;
    pdfBase64?: string;
  }) => Promise<void>;
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
          if (await form.trigger(["title", "description"])) {
            if (selectedType === "BLANK") {
              form.handleSubmit(onSubmit)();
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
