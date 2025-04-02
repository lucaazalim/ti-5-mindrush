"use client";

import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";

interface SlideNavigationProps {
  questions: {
    id: string;
    text: string;
    answers: string[];
    correctAnswerIndex: number;
    type: "QUIZ" | "VERDADEIRO_FALSO";
  }[];

  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  addNewSlide: () => void;
  removeSlide: (index: number) => void;
}

export function SlideNavigation({
  questions,
  currentIndex,
  setCurrentIndex,
  addNewSlide,
  removeSlide,
}: SlideNavigationProps) {
  return (
    <aside className="flex h-full w-[180px] flex-col items-center gap-4 border-r bg-white px-2 py-6">
      <Button
        type="button"
        onClick={addNewSlide}
        className="h-[8px] w-[140px] rounded-sm"
      >
        Novo Slide
      </Button>

      <div className="flex w-full flex-col items-center gap-4">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className={`relative w-[148px] rounded-md border p-5 text-left text-sm ${
              currentIndex === index ? "border-primary" : "border-muted"
            }`}
          >
            <button
              className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
              onClick={() => removeSlide(index)}
            >
              <Trash2 size={14} />
            </button>

            <button
              className="w-full text-left"
              onClick={() => setCurrentIndex(index)}
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
