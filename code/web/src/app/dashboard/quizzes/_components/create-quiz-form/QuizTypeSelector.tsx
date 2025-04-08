"use client"

type QuizType = "BLANK" | "THEME_GENERATED" | "PDF_GENERATED";

interface QuizOption {
  value: QuizType;
  label: string;
  description: string;
}

interface QuizTypeSelectorProps {
  selectedType: string;
  onSelect: (value: QuizType) => void;
}

const quizTypes: QuizOption[] = [
  { value: "BLANK", label: "Quiz em Branco", description: "Crie manualmente suas perguntas." },
  { value: "THEME_GENERATED", label: "Gerado por IA", description: "A IA cria perguntas automaticamente." },
  { value: "PDF_GENERATED", label: "Gerado por PDF", description: "Carregue um PDF e gere perguntas." }
];

export default function QuizTypeSelector({ selectedType, onSelect }: QuizTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {quizTypes.map((option) => (
        <div
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 
            ${selectedType === option.value ? "border-blue-500 bg-blue-100 shadow-md" : "border-gray-300 hover:border-gray-400"}
            hover:shadow-lg`}
        >
          <p className="text-lg font-semibold">{option.label}</p>
          <p className="text-sm text-gray-600">{option.description}</p>
        </div>
      ))}
    </div>
  );
}