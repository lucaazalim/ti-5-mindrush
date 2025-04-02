"use client"

import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import QuizTypeSelector from "./QuizTypeSelector";
import QuizBasicInfos from "./QuizBasicInfos";

export default function QuizStepOne({ form }: { form: any }) {
  return (
    <>
      <QuizBasicInfos form={form} />

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