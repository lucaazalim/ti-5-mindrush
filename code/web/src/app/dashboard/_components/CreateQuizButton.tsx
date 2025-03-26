"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Modal from "./Modal";
import { createQuiz } from "~/server/quiz";

export default function CreateQuizButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const educatorId = "ff61bc2b-078f-4292-8ad7-7be4e65a4b94";

  const handleCreateQuiz = async (title: string, description: string) => {
    try {
      await createQuiz(educatorId, title, description);
      alert("Quiz criado com sucesso!");
      setIsModalOpen(false); 
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
      alert("Erro ao criar quiz. Tente novamente!");
    }
  };

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
        Criar quiz
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateQuiz={handleCreateQuiz} 
      />
    </>
  );
}
