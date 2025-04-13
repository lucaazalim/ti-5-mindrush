"use client";

import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
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
    <aside className="flex h-full w-[200px] flex-col items-center gap-4 border-r bg-white px-2 py-6">
      <Button
        type="button"
        onClick={onAdd}
        className="h-[8px] w-[140px] rounded-sm"
      >
        Novo Slide
      </Button>

      <div className="flex w-full flex-col items-center gap-4">
        {questions.map((q, index) => (
          <div
            key={q.id || index}
            className={`relative w-[148px] rounded-md border p-5 text-left text-sm transition-colors ${
              currentSlide === index ? "border-primary" : "border-muted"
            }`}
          >
            {questions.length > 1 && (
              <button
                type="button"
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(index)}
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              type="button"
              className="w-full text-left"
              onClick={() => onSlideChange(index)}
            >
              <div className="mb-1 text-xs font-semibold">
                {index + 1}.{" "}
                {q.type === "QUIZ" ? "Quiz" : "Verdadeiro ou falso"}
              </div>

              <div className="flex flex-wrap gap-1">
                {q.answers.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded border px-1 text-xs ${
                      q.correctAnswerIndex === i
                        ? "border-green-500 text-green-600"
                        : "border-muted text-muted-foreground"
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
