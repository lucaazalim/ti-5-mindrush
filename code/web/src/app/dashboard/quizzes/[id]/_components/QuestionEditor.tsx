import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Textarea } from "~/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
  imageBase64?: string;
  onImageChange: (base64: string | null) => void;
}

export function QuestionEditor({ value, onChange, imageBase64, onImageChange }: Props) {
  const [preview, setPreview] = useState<string | null>(imageBase64 ?? null);

  useEffect(() => {
    setPreview(imageBase64 ?? null);
  }, [imageBase64]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      <Textarea
        id="question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Quais os tipos de alocação de memória do Java?"
        className="min-h-[40px] resize-none border border-primary bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-muted dark:text-foreground"
      />

      <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-2 text-center transition hover:bg-gray-100 dark:border-muted dark:bg-muted/50 dark:hover:bg-muted">
        {!preview ? (
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center space-y-2 text-gray-500 dark:text-muted-foreground"
          >
            <ImagePlus className="h-10 w-10" />
            <span className="font-medium">Clique para adicionar imagem</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">
            {preview && (
              <div className="my-1 flex justify-center">
                <Image
                  src={preview}
                  alt="Imagem da pergunta"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="max-h-[130px] w-auto rounded-lg border border-muted object-contain shadow-sm"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 rounded-full border border-gray-300 bg-white p-1 text-gray-700 shadow-sm hover:bg-gray-100 dark:border-muted dark:bg-background dark:text-muted-foreground dark:hover:bg-muted"
              title="Remover imagem"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
