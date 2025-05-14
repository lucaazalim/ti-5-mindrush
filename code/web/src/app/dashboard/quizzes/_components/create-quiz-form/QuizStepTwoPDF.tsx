"use client";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import pdfToText from "react-pdftotext";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { quizCreateSchema } from "../../form-schema";

export default function QuizStepTwoPDF() {
  const form = useFormContext<z.infer<typeof quizCreateSchema>>();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <FormField
      control={form.control}
      name="pdfText"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Enviar PDF</FormLabel>
          <FormControl>
            <label
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition",
                fileName ? "border-green-400 bg-green-100" : "border-gray-300 hover:bg-gray-100",
              )}
            >
              <Upload className="mb-2 h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {fileName ?? "Clique para enviar um arquivo PDF"}
              </span>
              <Input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    pdfToText(file)
                      .then((text) => field.onChange(text))
                      .catch((_error) => console.error("Failed to extract text from pdf"));
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
