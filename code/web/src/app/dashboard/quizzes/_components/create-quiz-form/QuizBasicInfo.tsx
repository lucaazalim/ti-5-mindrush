"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { quizCreateSchema } from "../../form-schema";

export default function QuizBasicInfo() {
  const form = useFormContext<z.infer<typeof quizCreateSchema>>();

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="História do Brasil" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input placeholder="Revisão do capítulo 4" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
