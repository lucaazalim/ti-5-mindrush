"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type QuizType } from "../QuizManualForm";

interface SidebarSettingsProps {
  quizType: QuizType;
  onChangeType: (type: QuizType) => void;
}

export function SidebarSettings({
  quizType,
  onChangeType,
}: SidebarSettingsProps) {
  return (
    <aside className="w-[180px] border-l bg-white p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Select
            value={quizType}
            onValueChange={(value: QuizType) => onChangeType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de pergunta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QUIZ">Quiz</SelectItem>
              <SelectItem value="VERDADEIRO_FALSO">
                Verdadeiro ou falso
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}
