import { Textarea } from "~/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function QuestionEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Textarea
        id="question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Quais os tipos de alocação de memória do Java?"
        className="min-h-[80px] resize-none border border-primary bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
