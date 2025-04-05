"use client"

import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import QuizTypeSelector from "./QuizTypeSelector";
import QuizBasicInfo from "./QuizBasicInfo";

export default function QuizStepOne({ form }: { form: any }) {
  return (
    <>
      <QuizBasicInfo formContext={form} />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <QuizTypeSelector
                selectedType={field.value}
                onSelect={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}