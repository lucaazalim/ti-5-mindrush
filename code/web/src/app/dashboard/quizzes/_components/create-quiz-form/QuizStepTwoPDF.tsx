"use client";

import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Upload } from "lucide-react";

export default function QuizStepTwoPDF({ form }: { form: any }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
      <FormField
        control={form.control}
        name="pdfBase64"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enviar PDF</FormLabel>
            <FormControl>
              <label
                className={cn(
                  "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer p-8 transition",
                  fileName ? "border-green-400 bg-green-100" : "border-gray-300 hover:bg-gray-100"
                )}
              >
                <Upload className="h-6 w-6 mb-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {fileName ? fileName : "Clique para enviar um arquivo PDF"}
                </span>
                <Input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => field.onChange(reader.result as string);
                      setFileName(file.name);
                    }
                  }}
                />
              </label>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
  );
}