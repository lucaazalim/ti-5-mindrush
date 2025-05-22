import { Trash2 } from "lucide-react";
import BackButton from "~/app/dashboard/_components/BackButton";
import { Button } from "~/components/ui/button";
import { type QuestionWithRawAlternatives } from "~/lib/types";
import { QUESTION_ALTERNATIVES_STYLING, COLORS } from "~/lib/constants";

interface SlideNavigationProps {
  questions: QuestionWithRawAlternatives[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

export function SlideNavigation({
  questions,
  currentSlide,
  onSlideChange,
  onAdd,
  onDelete,
}: SlideNavigationProps) {
  return (
    <aside className="flex min-h-screen w-[200px] flex-col items-center gap-4 overflow-y-auto border-r bg-white px-2 py-6 dark:border-muted dark:bg-background">
      <div className="flex flex-col items-center gap-4">
        <BackButton href="/dashboard/quizzes" className="w-full" />
        <Button
          type="button"
          onClick={onAdd}
          data-testid="adicionar-questao"
          aria-label="Adicionar nova questão"
          className="h-[8px] w-[140px] rounded-sm"
        >
          Nova questão
        </Button>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        {questions.map((q, index) => (
          <div
            key={q.id || index}
            role="button"
            tabIndex={0}
            aria-label={`Selecionar questão ${index + 1}`}
            data-testid={`questao-${index}`}
            onClick={() => onSlideChange(index)}
            onKeyDown={(e) => e.key === "Enter" && onSlideChange(index)}
            className={`relative w-[148px] cursor-pointer rounded-md border p-5 text-left text-sm transition-colors ${
              currentSlide === index
                ? "border-primary bg-blue-50 dark:bg-muted/40"
                : "border-muted bg-white dark:border-muted dark:bg-muted"
            }`}
          >
            {questions.length > 1 && (
              <button
                type="button"
                aria-label={`Excluir questão ${index + 1}`}
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive dark:text-muted-foreground dark:hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
              >
                <Trash2 size={14} />
              </button>
            )}

            <div
              className="mb-1 text-xs font-semibold text-foreground dark:text-foreground"
              aria-hidden="true"
            >
              {index + 1}. {q.type === "QUIZ" ? "Quiz" : "Verdadeiro ou falso"}
            </div>

            <div className="flex flex-wrap gap-1" aria-hidden="true">
              {q.alternatives.map((_, i) => {
                const style =
                  QUESTION_ALTERNATIVES_STYLING[i % QUESTION_ALTERNATIVES_STYLING.length]!;
                const Icon = style.icon;
                const isCorrect = q.correctAlternativeIndex === i;

                const colorHex = COLORS[style.colorClassName] ?? "#000000";

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center rounded transition-transform ${
                      isCorrect ? "border-2 border-green-500 bg-green-100 p-[4px]" : "p-[2px]"
                    } hover:scale-110`}
                  >
                    <Icon
                      size={14}
                      style={{
                        stroke: colorHex,
                        fill: colorHex,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
