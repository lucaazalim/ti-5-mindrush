"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QuestionType, type QuestionWithRawAlternatives } from "~/lib/types";
import { QUESTION_TYPES, QUESTION_TYPES_NAMES } from "~/lib/constants";

interface Props {
  question: QuestionWithRawAlternatives;
  onUpdate: (updated: Partial<QuestionWithRawAlternatives>) => void;
  onSubmit: () => void;
}

export function SidebarSettings({ question, onUpdate, onSubmit }: Props) {
  return (
    <aside className="min-h-[calc(100vh-80px)] shrink-0 border-l bg-white px-4 py-6 md:w-[200px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <Select
            value={question.type}
            onValueChange={(value: QuestionType) => onUpdate({ type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de pergunta" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(QUESTION_TYPES_NAMES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Tempo limite (segundos)
          </label>
          <Input
            type="number"
            min={10}
            max={120}
            value={question.timeLimit}
            onChange={(e) =>
              onUpdate({ timeLimit: Number(e.target.value) || 30 })
            }
          />
        </div>

        <div className="flex h-full items-center justify-center">
          <Button
            type="button"
            onClick={onSubmit}
            className="h-[8px] w-[140px]"
          >
            Salvar Quiz
          </Button>
        </div>
      </div>
    </aside>
  );
}
