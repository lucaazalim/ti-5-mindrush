import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { QUESTION_ALTERNATIVES_STYLING } from "~/lib/constants";
import { QuestionType } from "~/lib/types";
import { cn } from "~/lib/utils";

interface Props {
  type: QuestionType;
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
    if (answers.length >= 4) return;
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
        {answers.slice(0, isVF ? 2 : answers.length).map((answer, index) => {
          const { icon: Icon, colorClassName: color } = QUESTION_ALTERNATIVES_STYLING[index]!;
          const isCorrect = correctAnswerIndex === index;

          return (
            <div key={index} className="relative flex items-center gap-2">
              <Input
                value={answer}
                placeholder={`Resposta ${index + 1}`}
                onChange={(e) => updateAnswer(index, e.target.value)}
                className={cn(
                  "cursor-pointer border-2 px-10 text-lg",
                  "text-white dark:text-white",
                  "placeholder:text-white/50",
                  isCorrect
                    ? `border-green-800 focus-visible:ring-green-500 ${color}`
                    : `${color} border-muted`,
                )}
              />

              <div
                className={cn(
                  "absolute left-2 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-md",
                  color,
                )}
              >
                <Icon className="h-4 w-4 fill-white text-white" />
              </div>

              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {!isVF && canDelete && (
                  <button
                    onClick={() => deleteAnswer(index)}
                    type="button"
                    className="text-white transition-all hover:scale-110"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onChangeCorrectIndex(index)}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border text-white/80 transition-all",
                    isCorrect
                      ? "border-green-600 bg-white text-green-600"
                      : "border-white/50 bg-white/10 hover:ring-1 hover:ring-white",
                  )}
                >
                  {isCorrect && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!isVF && canAdd && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-sm border px-4 py-1.5 text-sm font-medium shadow-sm hover:bg-white dark:hover:bg-muted/40"
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
