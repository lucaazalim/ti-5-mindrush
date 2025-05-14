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
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/lib/constants";
import { Uuid } from "~/lib/parsers";
import { isSuccess } from "~/lib/result";
import QuizStepOne from "./create-quiz-form/QuizStepOne";
import QuizStepTwoPDF from "./create-quiz-form/QuizStepTwoPDF";

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
      difficulty: "EASY",
      language: "PORTUGUESE",
    },
  });

  const selectedType = form.watch("type");

  function onSubmit(values: z.infer<typeof quizCreateSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-3xl">Criar quiz</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Criar um novo quiz</DialogTitle>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <QuizStepOne />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    loading={mutation.isPending}
                    onClick={async (e) => {
                      const isValid = await form.trigger(["title", "description"]);

                      if (!isValid) {
                        return;
                      }

                      if (selectedType === "PDF_GENERATED") {
                        setStep(2);
                        e.preventDefault();
                      }
                    }}
                  >
                    {selectedType === "PDF_GENERATED" ? "Continuar ->" : "Confirmar"}
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {selectedType === "PDF_GENERATED" && <QuizStepTwoPDF />}
                <div className="mt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Voltar
                  </Button>

                  <Button type="submit" loading={mutation.isPending}>
                    Confirmar
                  </Button>
                </div>
              </>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
