"use client";

import { useCreateQuizFormContext } from "~/app/dashboard/quizzes/form-schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QUIZ_DIFFICULTY_NAMES, QUIZ_LANGUAGE_NAMES } from "~/lib/constants";

export default function QuizStepTwoTheme() {
  const form = useCreateQuizFormContext();

  return (
    <div className="space-y-3">
      <>
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Dificuldade</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(QUIZ_DIFFICULTY_NAMES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Idioma</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(QUIZ_LANGUAGE_NAMES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    </div>
  );
}
