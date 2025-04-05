"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { cn } from "~/lib/utils";
import { type QuizType } from "./QuizManualForm";

interface Props {
  quizType: QuizType;
  answers: string[];
  correctIndex: number;
  onChange: (answers: string[]) => void;
  onSelectCorrect: (index: number) => void;
  onDeleteAnswer: (index: number) => void;
}

export function AnswersManager({
  quizType,
  answers,
  correctIndex,
  onChange,
  onSelectCorrect,
  onDeleteAnswer,
}: Props) {
  const isVF = quizType === "VERDADEIRO_FALSO";

  const updateAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    onChange(updated);
  };

  const addAnswer = () => {
    if ((isVF && answers.length >= 2) || answers.length >= 4) return;
    onChange([...answers, ""]);
  };

  const canDelete = answers.length > (isVF ? 2 : 2);
  const canAdd = isVF ? answers.length < 2 : answers.length < 4;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {answers.map((answer, index) => (
          <div key={index} className="relative">
            <Input
              value={answer}
              placeholder={`Resposta ${index + 1}`}
              onChange={(e) => updateAnswer(index, e.target.value)}
              onClick={() => onSelectCorrect(index)}
              className={cn(
                "cursor-pointer border-2 bg-[#f7fcff] pr-10",
                correctIndex === index
                  ? "border-green-500 focus-visible:ring-green-500"
                  : "border-muted",
              )}
            />

            {canDelete && (
              <button
                onClick={() => onDeleteAnswer(index)}
                type="button"
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {canAdd && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-sm border px-4 py-1.5 text-sm font-medium shadow-sm hover:bg-muted"
            onClick={addAnswer}
          >
            <Plus size={14} className="mr-2" />
            Adicionar resposta
          </Button>
        </div>
      )}
    </div>
  );
}
