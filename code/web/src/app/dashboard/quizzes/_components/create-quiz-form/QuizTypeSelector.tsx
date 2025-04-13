"use client";

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
  {
    value: "BLANK",
    label: "Quiz em Branco",
    description: "Crie manualmente suas perguntas.",
  },
  {
    value: "THEME_GENERATED",
    label: "Gerado por tema",
    description: "A IA criará perguntas a partir do tema.",
  },
  {
    value: "PDF_GENERATED",
    label: "Gerado por PDF",
    description: "A IA criará perguntas a partir do PDF.",
  },
];

export default function QuizTypeSelector({
  selectedType,
  onSelect,
}: QuizTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {quizTypes.map((option) => (
        <div
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`cursor-pointer rounded-lg border px-4 py-5 transition-all duration-200 ${selectedType === option.value ? "border-blue-500 bg-blue-100 shadow-md" : "border-gray-300 hover:border-gray-400"} hover:shadow-lg`}
        >
          <p className="pb-1 text-lg font-semibold leading-tight">
            {option.label}
          </p>
          <p className="text-sm text-gray-600">{option.description}</p>
        </div>
      ))}
    </div>
  );
}
