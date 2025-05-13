"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { createMatch } from "~/lib/actions/match";
import { ROUTES } from "~/lib/constants";
import { Uuid } from "~/lib/parsers";
import { isFailure } from "~/lib/result";
import { QuizWithQuestionCountAndActiveMatch } from "~/lib/types";

export default function CreateOrTrackMatchButton({
  quiz,
}: {
  quiz: QuizWithQuestionCountAndActiveMatch;
}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (quizId: Uuid) => {
      const result = await createMatch(quizId);
      if (isFailure(result)) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      toast.success("Partida criada com sucesso!");
      router.push(ROUTES.MATCH(data.id));
    },
    onError: (error) => {
      toast.error("Erro ao criar partida: " + error.message);
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
