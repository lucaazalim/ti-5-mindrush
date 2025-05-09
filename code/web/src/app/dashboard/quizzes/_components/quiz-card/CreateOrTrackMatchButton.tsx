"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/lib/constants";
import { isFailure } from "~/lib/result";
import { QuizWithQuestionCountAndActiveMatch } from "~/lib/types";
import { createMatch } from "~/lib/actions/match";

export default function CreateOrTrackMatchButton({
  quiz,
}: {
  quiz: QuizWithQuestionCountAndActiveMatch;
}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createMatch,
    onSuccess: (result) => {
      if (isFailure(result)) {
        toast.error("Erro ao criar partida: " + result.error);
        return;
      }

      toast.success("Partida criada com sucesso!");
      router.push(ROUTES.MATCH(result.data.id));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const activeMatch = quiz.activeMatch;

  return activeMatch ? (
    <Button className="mt-4 h-11" onClick={() => router.push(ROUTES.MATCH(activeMatch.id))}>
      Acompanhar partida
    </Button>
  ) : (
    <Button
      className="mt-4 h-11"
      onClick={() => mutation.mutate(quiz.id)}
      loading={mutation.isPending}
    >
      Criar partida
    </Button>
  );
}
