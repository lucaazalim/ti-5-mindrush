"use client";

import { useState } from "react";
import { type QuestionWithAnswers } from "~/lib/types";
import { QuestionEditor } from "./QuestionEditor";
import { AnswersManager } from "./AnswersManager";
import { SlideNavigation } from "./SlideNavigation";
import { SidebarSettings } from "./SidebarSettings";
import { saveQuestionsAndAnswers } from "~/server/actions/question-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  quizId: string;
  initialQuestions?: QuestionWithAnswers[];
}

export type QuizType = "QUIZ" | "TRUE_OR_FALSE";

export default function QuizManualForm({
  quizId,
  initialQuestions = [],
}: Props) {
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>(
    initialQuestions.length > 0
      ? initialQuestions
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

  const updateCurrentQuestion = (updated: Partial<QuestionWithAnswers>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentSlide ? { ...q, ...updated } : q)),
    );
  };

  const handleChangeAnswer = (answers: string[]) => {
    updateCurrentQuestion({ answers });
  };

  const handleChangeCorrectIndex = (index: number) => {
    updateCurrentQuestion({ correctAnswerIndex: index });
  };

  const handleAddQuestion = () => {
    const newQuestion: QuestionWithAnswers = {
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
      await saveQuestionsAndAnswers({
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
