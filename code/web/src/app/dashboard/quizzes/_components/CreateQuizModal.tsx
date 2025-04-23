"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

import { createQuiz } from "~/server/actions/quiz";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type CreateQuizSchema, quizCreateSchema } from "~/app/dashboard/quizzes/form-schema";
import { ROUTES } from "~/lib/constants";
import { isSuccess } from "~/lib/result";
import { Uuid } from "~/lib/types";
import QuizStepOne from "./create-quiz-form/QuizStepOne";
import QuizStepTwoPDF from "./create-quiz-form/QuizStepTwoPDF";
import QuizStepTwoAI from "./create-quiz-form/QuizStepTwoTheme";
import StepOneActions from "./create-quiz-form/StepOneActions";
import StepTwoActions from "./create-quiz-form/StepTwoActions";

export function CreateQuizModal({ educatorId }: { educatorId: Uuid }) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const methods = useForm<CreateQuizSchema>({
    resolver: zodResolver(quizCreateSchema),
    mode: "onChange",
    defaultValues: {
      educatorId,
      title: "",
      description: "",
      type: "BLANK",
      theme: "",
      difficulty: "EASY",
      language: "",
    } as CreateQuizSchema,
  });

  const selectedType = methods.watch("type");

  async function onSubmit(values: CreateQuizSchema) {
    const result = await createQuiz(values);

    if (isSuccess(result)) {
      toast.success("Quiz criado com sucesso!");
      router.push(ROUTES.QUIZ(result.data.id));
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="rounded-3xl bg-primary px-8 py-3 text-sm font-medium text-white">
        Criar quiz
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Criar um novo quiz</DialogTitle>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <QuizStepOne />
                <StepOneActions selectedType={selectedType} setStep={setStep} onSubmit={onSubmit} />
              </>
            )}

            {step === 2 && (
              <>
                {selectedType === "THEME_GENERATED" && <QuizStepTwoAI />}
                {selectedType === "PDF_GENERATED" && <QuizStepTwoPDF />}
                <StepTwoActions setStep={setStep} />
              </>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
