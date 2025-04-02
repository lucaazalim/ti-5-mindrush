"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";

import { createQuiz } from "~/server/quiz";

import QuizStepOne from "./components/QuizStepOne";
import QuizStepTwoAI from "./components/QuizStepTwoAI";
import QuizStepTwoPDF from "./components/QuizStepTwoPDF";
import StepOneActions from "./components/StepOneActions";
import StepTwoActions from "./components/StepTwoActions";

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
  .refine((data) => data.type !== "AI_GENERATED" || !!data.theme, {
    message: "O tema é obrigatório para quizzes gerados por IA.",
    path: ["theme"],
  })
  .refine((data) => data.type !== "AI_GENERATED" || !!data.difficulty, {
    message: "A dificuldade é obrigatória para quizzes gerados por IA.",
    path: ["difficulty"],
  })
  .refine((data) => data.type !== "AI_GENERATED" || !!data.language, {
    message: "O idioma é obrigatório para quizzes gerados por IA.",
    path: ["language"],
  })
  .refine((data) => data.type !== "PDF_GENERATED" || !!data.pdfBase64, {
    message: "Faça o upload de um arquivo PDF.",
    path: ["pdfBase64"],
  });

type QuizInput = z.infer<typeof quizSchema>;

export function CreateQuizModal({ educatorId }: { educatorId: string }) {
  const [step, setStep] = useState(1);

  const form = useForm<QuizInput>({
    resolver: zodResolver(quizSchema),
    mode: "onChange",
    defaultValues: {
      educatorId,
      type: "BLANK",
    },
  });

  const selectedType = form.watch("type");

  async function onSubmit(values: QuizInput) {
    try {
      const result = await createQuiz(values);

      if (values.type === "BLANK" && result?.id) {
        window.location.href = `/dashboard/manual?id=${result.id}`;
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Erro ao criar o quiz. Tente novamente.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="rounded-3xl bg-primary px-8 py-3 text-sm font-medium text-white">
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
                {selectedType === "PDF_GENERATED" && (
                  <QuizStepTwoPDF form={form} />
                )}
                <StepTwoActions setStep={setStep} />
              </>
            )}
          </form>
        </Form>

        {step === 1 && (
          <StepOneActions
            form={form}
            selectedType={selectedType}
            setStep={setStep}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
