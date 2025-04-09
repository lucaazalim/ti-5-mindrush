import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";

interface QuizFormValues {
  educatorId: string;
  title: string;
  description: string;
  type: "BLANK" | "THEME_GENERATED" | "PDF_GENERATED";
  theme?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  language?: string;
  pdfBase64?: string;
}

interface QuizNavigationButtonsProps {
  step: number;
  setStep: (step: number) => void;
  selectedType: string;
  onSubmit: (values: QuizFormValues) => Promise<void>;
}

export function QuizNavigationButtons({
  step,
  setStep,
  selectedType,
  onSubmit,
}: QuizNavigationButtonsProps) {
  const form = useFormContext<QuizFormValues>();

  const handleNext = async () => {
    let isValid = true;

    if (selectedType === "THEME_GENERATED") {
      isValid = await form.trigger(["theme", "difficulty", "language"]);
    } else if (selectedType === "PDF_GENERATED") {
      isValid = await form.trigger(["pdfBase64"]);
    }

    if (isValid) {
      await form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="mt-4 flex justify-between">
      {step === 2 && (
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          Voltar
        </Button>
      )}
      <Button type="submit" onClick={handleNext}>
        {step === 1 ? "Continuar" : "Criar quiz"}
      </Button>
    </div>
  );
}
