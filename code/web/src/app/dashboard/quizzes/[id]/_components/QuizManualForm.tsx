"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { QuestionWithAlternatives, QuestionWithRawAlternatives } from "~/lib/types";
import { saveQuestionsAndAlternatives } from "~/server/actions/question-actions";
import { AnswersManager } from "./AnswersManager";
import { QuestionEditor } from "./QuestionEditor";
import { SidebarSettings } from "./SidebarSettings";
import { SlideNavigation } from "./SlideNavigation";

interface Props {
  quizId: string;
  initialQuestions?: QuestionWithAlternatives[];
}

export default function QuizManualForm({ quizId, initialQuestions = [] }: Props) {
  const [questions, setQuestions] = useState<QuestionWithRawAlternatives[]>(
    initialQuestions.length > 0
      ? initialQuestions.map((q) => ({
          ...q,
          answers: q.alternatives.map((a) => a.answer),
          correctAnswerIndex: q.alternatives.findIndex((a) => a.correct),
        }))
      : [
          {
            id: "",
            question: "",
            quizId,
            type: "QUIZ",
            createdAt: new Date(),
            timeLimit: 30,
            answers: ["", "", "", ""],
            correctAnswerIndex: 0,
          },
        ],
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const currentQuestion = questions[currentSlide];
  if (!currentQuestion) return null;

  const updateCurrentQuestion = (updated: Partial<QuestionWithRawAlternatives>) => {
    setQuestions((prev) => prev.map((q, i) => (i === currentSlide ? { ...q, ...updated } : q)));
  };

  const handleChangeAnswer = (answers: string[]) => {
    updateCurrentQuestion({ answers });
  };

  const handleChangeCorrectIndex = (index: number) => {
    updateCurrentQuestion({ correctAnswerIndex: index });
  };

  const handleAddQuestion = () => {
    const newQuestion: QuestionWithRawAlternatives = {
      id: "",
      question: "",
      quizId,
      type: "QUIZ",
      createdAt: new Date(),
      timeLimit: 30,
      answers: ["", "", "", ""],
      correctAnswerIndex: 0,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentSlide(questions.length);
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
    try {
      await saveQuestionsAndAlternatives({
        quizId,
        questions: questions.map((q) => ({
          text: q.question,
          answers: q.answers,
          correctAnswerIndex: q.correctAnswerIndex,
          type: q.type,
        })),
      });

      toast.success("Perguntas salvas com sucesso!");
      router.push("/dashboard/quizzes");
    } catch (error) {
      toast.error("Erro ao salvar perguntas.");
      console.error(error);
    }
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
        />
        <AnswersManager
          type={currentQuestion.type}
          answers={currentQuestion.answers}
          correctAnswerIndex={currentQuestion.correctAnswerIndex}
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
