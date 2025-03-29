"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import QuizTypeSelector from "./QuizTypeSelector";
import { createQuiz } from "~/server/quiz";

// Definição do schema de validação com Zod
const quizSchema = z.object({
    educatorId: z.string().uuid(),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z.string().min(8, "A descrição deve ter pelo menos 8 caracteres"),
    type: z.enum(["BLANK", "AI_GENERATED", "PDF_GENERATED"]),
    theme: z.string().optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    language: z.string().optional(),
    pdfBase64: z.string().optional(),
});

type QuizInput = z.infer<typeof quizSchema>;

export function CreateQuizModal({ educatorId }: { educatorId: string }) {
    const [step, setStep] = useState(1); // Controla os steps
    const form = useForm<QuizInput>({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            educatorId: educatorId,
            type: "BLANK"
        },
    });

    const selectedType = form.watch("type");

    async function onSubmit(values: QuizInput) {
        const data = await createQuiz(values);
        window.location.reload();
    }

    return (
        <Dialog>
            <DialogTrigger className="bg-primary text-white rounded-3xl px-4 py-2">
                Criar quiz
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Criar um novo quiz</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && (
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
                                                <Input placeholder="Revisão do capítulo 4" {...field} />
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
                                                <QuizTypeSelector selectedType={field.value} onSelect={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                {/* Inputs específicos para AI_GENERATED */}
                                {selectedType === "AI_GENERATED" && (
                                    <>
                                        <div className="space-y-4">

                                            <FormField
                                                control={form.control}
                                                name="theme"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel>Tema</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Digite o tema do quiz" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
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
                                                                    <SelectItem value="EASY">Fácil</SelectItem>
                                                                    <SelectItem value="MEDIUM">Média</SelectItem>
                                                                    <SelectItem value="HARD">Difícil</SelectItem>
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
                                                            <Input placeholder="Digite o idioma do quiz" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Input específico para PDF_GENERATED */}
                                {selectedType === "PDF_GENERATED" && (
                                    <FormField
                                        control={form.control}
                                        name="pdfBase64"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enviar PDF</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept="application/pdf" onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.readAsDataURL(file);
                                                            reader.onload = () => {
                                                                field.onChange(reader.result as string);
                                                            };
                                                        }
                                                    }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* Botões de navegação */}
                                <div className="flex justify-between mt-4">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                                    <Button type="submit">Criar Quiz</Button>
                                </div>
                            </>
                        )}
                    </form>
                </Form>

                {/* Lógica para avançar para o próximo step */}
                {step === 1 && selectedType && (
                    <div className="flex justify-center">
                        <Button type="button" onClick={() => setStep(2)}>Continuar</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
