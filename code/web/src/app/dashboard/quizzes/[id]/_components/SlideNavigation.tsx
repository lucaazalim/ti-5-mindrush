"use client";

import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type QuestionWithRawAlternatives } from "~/lib/types";

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
      <Button type="button" onClick={onAdd} className="h-[8px] w-[140px] rounded-sm">
        Nova questão
      </Button>

      <div className="flex w-full flex-col items-center gap-4">
        {questions.map((q, index) => (
          <div
            key={q.id || index}
            className={`relative w-[148px] rounded-md border p-5 text-left text-sm transition-colors ${
              currentSlide === index ? "border-primary" : "border-muted dark:border-muted"
            } bg-white dark:bg-muted`}
          >
            {questions.length > 1 && (
              <button
                type="button"
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive dark:text-muted-foreground dark:hover:text-destructive"
                onClick={() => onDelete(index)}
              >
                <Trash2 size={14} />
              </button>
            )}

            <button type="button" className="w-full text-left" onClick={() => onSlideChange(index)}>
              <div className="mb-1 text-xs font-semibold text-foreground dark:text-foreground">
                {index + 1}. {q.type === "QUIZ" ? "Quiz" : "Verdadeiro ou falso"}
              </div>

              <div className="flex flex-wrap gap-1">
                {q.alternatives.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded border px-1 text-xs ${
                      q.correctAlternativeIndex === i
                        ? "border-green-500 text-green-600"
                        : "border-muted text-muted-foreground dark:border-muted dark:text-muted-foreground"
                    }`}
                  >
                    --
                  </div>
                ))}
              </div>
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
