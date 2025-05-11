"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

import { createQuiz } from "~/lib/actions/quiz";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { quizCreateSchema } from "~/app/dashboard/quizzes/form-schema";
import { ROUTES } from "~/lib/constants";
import { Uuid } from "~/lib/parsers";
import { isSuccess } from "~/lib/result";
import QuizStepOne from "./create-quiz-form/QuizStepOne";
import QuizStepTwoPDF from "./create-quiz-form/QuizStepTwoPDF";
import QuizStepTwoAI from "./create-quiz-form/QuizStepTwoTheme";
import StepOneActions from "./create-quiz-form/StepOneActions";
import StepTwoActions from "./create-quiz-form/StepTwoActions";

export function CreateQuizModal({ educatorId }: { educatorId: Uuid }) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: (result) => {
      if (isSuccess(result)) {
        toast.success("Quiz criado com sucesso!");
        router.push(ROUTES.QUIZ(result.data.id));
      } else {
        toast.error(result.error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof quizCreateSchema>>({
    resolver: zodResolver(quizCreateSchema),
    mode: "onChange",
    defaultValues: {
      educatorId,
      title: "",
      description: "",
      type: "BLANK",
    },
  });

  const selectedType = form.watch("type");

  function onSubmit(values: z.infer<typeof quizCreateSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger className="rounded-3xl bg-primary px-8 py-3 text-sm font-medium text-white">
        Criar quiz
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Criar um novo quiz</DialogTitle>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
