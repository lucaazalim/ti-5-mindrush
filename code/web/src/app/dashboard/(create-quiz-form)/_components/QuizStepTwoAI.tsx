"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export default function QuizTypeSpecificForm({ form, }: { form: any }) {
  return (
    <div className="space-y-4">
      <>
        <FormField control={form.control} name="theme" render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Tema</FormLabel>
            <FormControl>
              <Input placeholder="Digite o tema do quiz" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="difficulty" render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Dificuldade</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Escolha a dificuldade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Fácil</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HARD">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="language" render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Idioma</FormLabel>
            <FormControl>
              <Input placeholder="Digite o idioma do quiz" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </>
    </div>
  );
}