"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "~/lib/constants";
import { isFailure } from "~/lib/result";
import type { QuestionWithAlternatives, QuestionWithRawAlternatives, Uuid } from "~/lib/types";
import { createQuestionsAndAlternatives } from "~/server/actions/question";
import { AnswersManager } from "./AnswersManager";
import { QuestionEditor } from "./QuestionEditor";
import { SidebarSettings } from "./SidebarSettings";
import { SlideNavigation } from "./SlideNavigation";

interface Props {
  quizId: Uuid;
  initialQuestions?: QuestionWithAlternatives[];
}

export default function QuizManualForm({ quizId, initialQuestions = [] }: Props) {
  function getDummyQuestion(type: "QUIZ" | "TRUE_OR_FALSE" = "QUIZ"): QuestionWithRawAlternatives {
    return {
      id: "" as Uuid,
      quizId,
      question: "",
      type,
      timeLimit: 30,
      image: null,
      createdAt: new Date(),
      order: Math.floor(Math.random() * 1000),
      alternatives: type === "TRUE_OR_FALSE" ? ["Verdadeiro", "Falso"] : ["", "", "", ""],
      correctAlternativeIndex: 0,
    };
  }

  const [questions, setQuestions] = useState<QuestionWithRawAlternatives[]>(
    initialQuestions.length > 0
      ? initialQuestions.map((quiz) => ({
          ...quiz,
          image: quiz.image ?? null,
          alternatives: quiz.alternatives.map((alternative) => alternative.answer),
          correctAlternativeIndex: quiz.alternatives.findIndex((a) => a.isCorrect),
        }))
      : [getDummyQuestion()],
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const currentQuestion = questions[currentSlide];
  if (!currentQuestion) return null;

  const updateCurrentQuestion = (updated: Partial<QuestionWithRawAlternatives>) => {
    setQuestions((prev) => prev.map((q, i) => (i === currentSlide ? { ...q, ...updated } : q)));
  };

  const handleChangeAnswer = (answers: string[]) => {
    updateCurrentQuestion({ alternatives: answers });
  };

  const handleChangeCorrectIndex = (index: number) => {
    updateCurrentQuestion({ correctAlternativeIndex: index });
  };

  const handleAddQuestion = () => {
    const newQuestion = getDummyQuestion();
    setQuestions((prev) => {
      const updated = [...prev, newQuestion];
      setCurrentSlide(updated.length - 1);
      return updated;
    });
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) return;

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);

    if (currentSlide === index) {
      setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (currentSlide > index) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const result = await createQuestionsAndAlternatives({
      quizId,
      questions: questions.map((question) => {
        return {
          ...(question.id ? { id: question.id } : {}),
          question: question.question,
          order: question.order,
          type: question.type,
          timeLimit: question.timeLimit,
          image: question.image ?? null,
          alternatives: question.alternatives,
          correctAlternativeIndex: question.correctAlternativeIndex,
        };
      }),
    });

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    toast.success("Questões salvas com sucesso!");
    router.push(ROUTES.QUIZZES);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="h-full w-[200px] shrink-0 border-r border-muted">
        <SlideNavigation
          questions={questions}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
          onAdd={handleAddQuestion}
          onDelete={handleDeleteQuestion}
        />
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <QuestionEditor
          value={currentQuestion.question}
          onChange={(val) => updateCurrentQuestion({ question: val })}
          imageBase64={currentQuestion.image ?? undefined}
          onImageChange={(image) => updateCurrentQuestion({ image })}
        />

        <AnswersManager
          type={currentQuestion.type}
          answers={currentQuestion.alternatives}
          correctAnswerIndex={currentQuestion.correctAlternativeIndex}
          onChangeAnswers={handleChangeAnswer}
          onChangeCorrectIndex={handleChangeCorrectIndex}
        />
      </div>

      <div className="w-[200px] shrink-0 border-l border-muted">
        <SidebarSettings
          question={currentQuestion}
          onUpdate={updateCurrentQuestion}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
