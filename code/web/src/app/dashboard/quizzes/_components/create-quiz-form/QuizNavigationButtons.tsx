"use client"

import { Button } from "~/components/ui/button";

interface QuizNavigationButtonsProps {
  step: number; setStep: (step: number) => void; selectedType: string; form: any;
  onSubmit: (values: {
    educatorId: string;
    title: string;
    description: string;
    type: "BLANK" | "THEME_GENERATED" | "PDF_GENERATED";
    theme?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    language?: string;
    pdfBase64?: string;
  }) => Promise<void>;
}

export function QuizNavigationButtons({ step, setStep, selectedType, form, onSubmit }: QuizNavigationButtonsProps) {
  return (
    <div className="mt-4 flex justify-between">
      {step === 2 && (
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          Voltar
        </Button>
      )}
      <Button
        type="submit"
        onClick={async () => {
          let isValid = true;

          if (selectedType === "THEME_GENERATED") {
            isValid = await form.trigger(["theme", "difficulty", "language"]);
          } else if (selectedType === "PDF_GENERATED") {
            isValid = await form.trigger(["pdfBase64"]);
          }

          if (isValid) {
            form.handleSubmit(onSubmit)();
          }
        }}
      >
        {step === 1 ? "Continuar" : "Criar Quiz"}
      </Button>
    </div>
  );
}