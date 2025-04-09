import { Input } from "~/components/ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function QuestionEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Input
        id="question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite a pergunta aqui..."
      />
    </div>
  );
}
