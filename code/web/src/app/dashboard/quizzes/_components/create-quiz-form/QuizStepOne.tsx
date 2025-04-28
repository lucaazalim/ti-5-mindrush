"use client";

import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import QuizTypeSelector from "./QuizTypeSelector";
import QuizBasicInfo from "./QuizBasicInfo";
import { useCreateQuizFormContext } from "~/app/dashboard/quizzes/form-schema";

export default function QuizStepOne() {
  const form = useCreateQuizFormContext();

  return (
    <>
      <QuizBasicInfo />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <QuizTypeSelector selectedType={field.value} onSelect={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
