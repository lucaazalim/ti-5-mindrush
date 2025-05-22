import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QUESTION_TYPES_NAMES } from "~/lib/constants";
import { QuestionType, type QuestionWithRawAlternatives } from "~/lib/types";

interface Props {
  question: QuestionWithRawAlternatives;
  onUpdate: (updated: Partial<QuestionWithRawAlternatives>) => void;
  onSubmit: () => void;
}

export function SidebarSettings({ question, onUpdate, onSubmit }: Props) {
  return (
    <aside className="flex min-h-screen w-[200px] flex-col items-center gap-4 overflow-y-auto border-r bg-white px-2 py-6 dark:bg-background">
      <div className="w-full space-y-4 px-2">
        <div className="space-y-2">
          <label htmlFor="question-type" className="mb-1 block text-sm font-medium">
            Tipo de questão
          </label>
          <Select
            value={question.type}
            onValueChange={(value: QuestionType) => {
              onUpdate({
                type: value,
                alternatives:
                  value === "TRUE_OR_FALSE" ? ["Verdadeiro", "Falso"] : ["", "", "", ""],
                correctAlternativeIndex: 0,
              });
            }}
          >
            <SelectTrigger id="question-type" aria-label="Tipo de questão">
              <SelectValue placeholder="Tipo de questão" />
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
          <label htmlFor="time-limit" className="mb-1 block text-sm font-medium">
            Tempo limite (segundos)
          </label>
          <Input
            id="time-limit"
            type="number"
            min={10}
            max={120}
            aria-label="Tempo limite da questão"
            value={question.timeLimit}
            onChange={(e) => onUpdate({ timeLimit: Number(e.target.value) || 30 })}
          />
        </div>

        <Button
          type="button"
          onClick={onSubmit}
          className="w-full"
          aria-label="Salvar quiz"
          data-testid="salvar-quiz"
        >
          Salvar quiz
        </Button>
      </div>
    </aside>
  );
}
