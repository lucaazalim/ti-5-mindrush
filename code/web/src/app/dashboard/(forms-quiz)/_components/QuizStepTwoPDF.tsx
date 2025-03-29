"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"

export default function QuizStepTwoPDF({ form }: { form: any }) {
  return (
    <>
      <div className="space-y-4">
        <FormField control={form.control} name="pdfBase64" render={({ field }) => (
          <FormItem>
            <FormLabel>Enviar PDF</FormLabel>
            <FormControl>
              <Input type="file" accept="application/pdf" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => field.onChange(reader.result as string);
                }
              }} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </>
  )
}
