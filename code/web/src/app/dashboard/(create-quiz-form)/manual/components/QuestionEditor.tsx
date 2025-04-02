"use client";

import { Textarea } from "~/components/ui/textarea";

export type QuestionEditorProps = {
  question: {
    text: string;
  };
  onChange: (q: { text: string }) => void;
};

export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Textarea
          id="question"
          className="min-h-[80px] resize-none border border-primary bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Ex: Quais os tipos de alocação de memória do Java?"
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </div>
    </div>
  );
}
