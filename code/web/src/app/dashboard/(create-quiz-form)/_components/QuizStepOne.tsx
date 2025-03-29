import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import QuizTypeSelector from "../QuizTypeSelector";

export default function QuizStepOne({ form }: { form: any }) {
  return (
    <>
      <div className="space-y-4">
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
                <Input
                  placeholder="Revisão do capítulo 4"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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