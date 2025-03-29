"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { createQuiz } from "~/server/quiz";
import QuizStepOne from "./_components/QuizStepOne";
import QuizStepTwoAI from "./_components/QuizStepTwoAI";
import QuizStepTwoPDF from "./_components/QuizStepTwoPDF";

const quizSchema = z
  .object({
    educatorId: z.string().uuid(),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z
      .string()
      .min(8, "A descrição deve ter pelo menos 8 caracteres"),
    type: z.enum(["BLANK", "AI_GENERATED", "PDF_GENERATED"]),
    theme: z
      .string()
      .min(3, "O tema deve ter pelo menos 3 caracteres")
      .optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    language: z
      .string()
      .min(2, "O idioma deve ter pelo menos 2 caracteres")
      .optional(),
    pdfBase64: z.string().optional(),
  })
  // Validação individual para "theme"
  .refine((data) => data.type !== "AI_GENERATED" || !!data.theme, {
    message: "O tema é obrigatório para quizzes gerados por IA.",
    path: ["theme"],
  })
  // Validação individual para "difficulty"
  .refine((data) => data.type !== "AI_GENERATED" || !!data.difficulty, {
    message: "A dificuldade é obrigatória para quizzes gerados por IA.",
    path: ["difficulty"],
  })
  // Validação individual para "language"
  .refine((data) => data.type !== "AI_GENERATED" || !!data.language, {
    message: "O idioma é obrigatório para quizzes gerados por IA.",
    path: ["language"],
  })
  // Validação do PDF quando for "PDF_GENERATED"
  .refine((data) => data.type !== "PDF_GENERATED" || !!data.pdfBase64, {
    message: "Faça o upload de um arquivo PDF.",
    path: ["pdfBase64"],
  });

type QuizInput = z.infer<typeof quizSchema>;

export function CreateQuizModal({ educatorId }: { educatorId: string }) {
  const [step, setStep] = useState(1); // Controla os steps
  const form = useForm<QuizInput>({
    resolver: zodResolver(quizSchema),
    mode: "onChange",
    defaultValues: {
      educatorId: educatorId,
      type: "BLANK",
    },
  });

  const selectedType = form.watch("type");

  async function onSubmit(values: QuizInput) {
    const data = await createQuiz(values);
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger className="rounded-3xl bg-primary px-4 py-2 text-white">
        Criar quiz
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Criar um novo quiz</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && <QuizStepOne form={form} />}

            {step === 2 && (
              <>
                {selectedType === "AI_GENERATED" && (
                  <QuizStepTwoAI form={form} />
                )}

                {/* Input específico para PDF_GENERATED */}
                {selectedType === "PDF_GENERATED" && (
                  <QuizStepTwoPDF form={form} />
                )}

                {/* Botões de navegação */}
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
                    onClick={async () => {
                      let isValid = true;

                      if (selectedType === "AI_GENERATED") {
                        isValid = await form.trigger([
                          "theme",
                          "difficulty",
                          "language",
                        ]);
                      } else if (selectedType === "PDF_GENERATED") {
                        isValid = await form.trigger(["pdfBase64"]);
                      }

                      if (isValid) {
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  >
                    Criar Quiz
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>

        {/* Lógica para avançar para o próximo step ou submeter o formulário */}
        {step === 1 && selectedType && (
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={async () => {
                const isValid = await form.trigger(["title", "description"]);
                if (isValid) {
                  if (selectedType === "BLANK") {
                    form.handleSubmit(onSubmit)();
                  } else {
                    setStep(2);
                  }
                }
              }}
            >
              Continuar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
