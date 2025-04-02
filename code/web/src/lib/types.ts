export type Quiz = {
    id: string;
    educatorId: string;
    title: string;
    description: string;
    type: "BLANK" | "AI_GENERATED" | "PDF_GENERATED";
    theme?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    language?: string;
    pdfBase64?: string;
    questionCount: number;
    createdAt: Date;
};

export type QuizUpdate = {
  title?: string;
  description?: string;
};