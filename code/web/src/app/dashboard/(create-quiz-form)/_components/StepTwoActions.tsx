import { Button } from "~/components/ui/button";

export default function StepTwoActions({ setStep }: { setStep: (step: number) => void }) {
    return (
        <div className="mt-4 flex justify-between">
            <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
            >
                Voltar
            </Button>

            <Button
                type="submit"
            >
                Criar Quiz
            </Button>
        </div>
    );
}   