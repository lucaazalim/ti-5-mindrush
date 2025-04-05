"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { QuestionEditor } from "./QuestionEditor";
import { AnswersManager } from "./AnswersManager";
import { SlideNavigation } from "./SlideNavigation";
import { SidebarSettings } from "./SidebarSettings";
import { Button } from "~/components/ui/button";
import { saveQuestionsAndAnswers } from "~/actions/question-actions";

export type QuizType = "QUIZ" | "VERDADEIRO_FALSO";

interface Question {
  id: string;
  text: string;
  answers: string[];
  correctAnswerIndex: number;
  type: QuizType;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
}

interface Alternative {
  answer: string;
  correct: boolean;
}

interface LoadedQuestion {
  id: string;
  question: string;
  type: string;
  alternatives: Alternative[];
}

export function QuizManualForm({
  quiz,
  initialQuestions = [],
}: {
  quiz: Quiz;
  initialQuestions?: LoadedQuestion[];
}) {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.length > 0
      ? initialQuestions.map((q) => ({
          id: q.id,
          text: q.question,
          answers: q.alternatives.map((a) => a.answer),
          correctAnswerIndex: q.alternatives.findIndex((a) => a.correct),
          type: q.type === "TRUE_OR_FALSE" ? "VERDADEIRO_FALSO" : "QUIZ",
        }))
      : [
          {
            id: nanoid(),
            text: "",
            answers: ["", ""],
            correctAnswerIndex: 0,
            type: "QUIZ",
          },
        ],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  function updateQuestion(updated: Partial<Question>) {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      const current = updatedQuestions[currentIndex];
      if (!current) return prev;

      const changedToVF =
        updated.type === "VERDADEIRO_FALSO" &&
        current.type !== "VERDADEIRO_FALSO";

      updatedQuestions[currentIndex] = {
        ...current,
        ...updated,
        ...(changedToVF && {
          correctAnswerIndex: 0,
        }),
      };

      return updatedQuestions;
    });
  }

  function addNewSlide() {
    setQuestions((prev) => [
      ...prev,
      {
        id: nanoid(),
        text: "",
        answers: ["", ""],
        correctAnswerIndex: 0,
        type: "QUIZ",
      },
    ]);
    setCurrentIndex(questions.length);
  }

  function removeSlide(index: number) {
    setQuestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (index === currentIndex && updated.length > 0) {
        setCurrentIndex(0);
      } else if (index < currentIndex) {
        setCurrentIndex((i) => i - 1);
      }
      return updated;
    });
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="flex-1 p-4 text-sm text-muted-foreground">
        Nenhuma pergunta selecionada.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <SlideNavigation
        questions={questions}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        addNewSlide={addNewSlide}
        removeSlide={removeSlide}
      />

      <main className="flex flex-1 justify-center overflow-y-auto px-10 py-10">
        <div className="w-full max-w-3xl space-y-6">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <QuestionEditor
            question={{ text: currentQuestion.text }}
            onChange={(q: { text: string }) => updateQuestion({ text: q.text })}
          />

          <AnswersManager
            quizType={currentQuestion.type}
            answers={currentQuestion.answers}
            correctIndex={currentQuestion.correctAnswerIndex}
            onChange={(newAnswers) => updateQuestion({ answers: newAnswers })}
            onSelectCorrect={(index) =>
              updateQuestion({ correctAnswerIndex: index })
            }
            onDeleteAnswer={(index) =>
              updateQuestion({
                answers: currentQuestion.answers.filter((_, i) => i !== index),
                correctAnswerIndex:
                  index === currentQuestion.correctAnswerIndex
                    ? 0
                    : currentQuestion.correctAnswerIndex,
              })
            }
          />

          <Button
            type="button"
            className="mx-auto block rounded-sm px-4 py-2 text-sm"
            onClick={async () => {
              const hasInvalid = questions.some((q) => {
                return (
                  !q.text.trim() ||
                  q.answers.some((a) => !a.trim()) ||
                  q.correctAnswerIndex < 0 ||
                  q.correctAnswerIndex >= q.answers.length
                );
              });

              if (hasInvalid) {
                alert(
                  "Preencha todas as perguntas e respostas antes de salvar.",
                );
                return;
              }

              try {
                await saveQuestionsAndAnswers({
                  quizId: quiz.id,
                  questions: questions.map(({ id, ...rest }) => rest),
                });

                window.location.href = `/dashboard`;
              } catch (error) {
                alert(
                  "Erro ao salvar perguntas. Verifique os dados e tente novamente.",
                );
              }
            }}
          >
            Salvar quiz
          </Button>
        </div>
      </main>

      <SidebarSettings
        quizType={currentQuestion.type}
        onChangeType={(type) => updateQuestion({ type })}
      />
    </div>
  );
}
