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

import QuizStepOne from "./create-quiz-form/QuizStepOne";
import QuizStepTwoAI from "./create-quiz-form/QuizStepTwoAI";
import QuizStepTwoPDF from "./create-quiz-form/QuizStepTwoPDF";
import StepOneActions from "./create-quiz-form/StepOneActions";
import StepTwoActions from "./create-quiz-form/StepTwoActions";
import {CreateQuizSchema, quizCreateSchema} from "~/app/dashboard/quizzes/form-schema";

export function CreateQuizModal({ educatorId }: { educatorId: string }) {
  const [step, setStep] = useState(1);

  const form = useForm<CreateQuizSchema>({
    resolver: zodResolver(quizCreateSchema),
    mode: "onChange",
    defaultValues: {
      educatorId,
      type: "BLANK",
    },
  });

  const selectedType = form.watch("type");

  async function onSubmit(values: CreateQuizSchema) {
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
