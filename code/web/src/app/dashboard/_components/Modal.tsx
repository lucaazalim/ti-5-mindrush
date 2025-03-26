"use client";

import React, { useState } from 'react';

// Props de Modal
export default function Modal({
  isOpen,
  onClose,
  onCreateQuiz,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuiz: (title: string, description: string) => void;
}) {
  // Estado para os campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Função chamada ao clicar em "Criar"
  const handleCreateQuiz = () => {
    if (title && description) {
      // Chama a função para criar o quiz
      onCreateQuiz(title, description);
      // Limpa os campos do formulário
      setTitle('');
      setDescription('');
      // Fecha o modal
      onClose();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Criar Quiz</h2>

        {/* Formulário */}
        <input
          type="text"
          placeholder="Título"
          className="w-full border rounded-lg p-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          className="w-full border rounded-lg p-2 mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Botões */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleCreateQuiz}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
