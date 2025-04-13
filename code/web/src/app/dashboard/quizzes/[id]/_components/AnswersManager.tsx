"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props {
  type: "QUIZ" | "TRUE_OR_FALSE";
  answers: string[];
  correctAnswerIndex: number;
  onChangeAnswers: (answers: string[]) => void;
  onChangeCorrectIndex: (index: number) => void;
}

export function AnswersManager({
  type,
  answers,
  correctAnswerIndex,
  onChangeAnswers,
  onChangeCorrectIndex,
}: Props) {
  const isVF = type === "TRUE_OR_FALSE";

  const updateAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    onChangeAnswers(updated);
  };

  const addAnswer = () => {
    if ((isVF && answers.length >= 2) || answers.length >= 4) return;
    onChangeAnswers([...answers, ""]);
  };

  const deleteAnswer = (index: number) => {
    if (answers.length <= 2) return;
    const updated = answers.filter((_, i) => i !== index);
    onChangeAnswers(updated);

    if (correctAnswerIndex === index) {
      onChangeCorrectIndex(-1);
    } else if (correctAnswerIndex > index) {
      onChangeCorrectIndex(correctAnswerIndex - 1);
    }
  };

  const canDelete = !isVF && answers.length > 2;
  const canAdd = !isVF && answers.length < 4;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {answers.map((answer, index) => (
          <div key={index} className="relative">
            <Input
              value={answer}
              placeholder={`Resposta ${index + 1}`}
              disabled={isVF}
              onChange={(e) => updateAnswer(index, e.target.value)}
              onClick={() => onChangeCorrectIndex(index)}
              className={cn(
                "cursor-pointer border-2 bg-[#f7fcff] pr-10",
                correctAnswerIndex === index
                  ? "border-green-500 focus-visible:ring-green-500"
                  : "border-muted",
              )}
            />

            {canDelete && (
              <button
                onClick={() => deleteAnswer(index)}
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
