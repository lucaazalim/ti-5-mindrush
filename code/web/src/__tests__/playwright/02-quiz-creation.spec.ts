import { expect, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("Create a new quiz from the dashboard", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");
  });

  await test.step("Open quiz creation form", async () => {
    const criarQuizBtn = page.getByText("Criar quiz", { exact: true });
    await expect(criarQuizBtn).toBeVisible();
    await criarQuizBtn.click();
  });

  await test.step("Fill in quiz details", async () => {
    const tituloInput = page.getByLabel("Título");
    const descricaoInput = page.getByLabel("Descrição");

    await tituloInput.fill("Estruturas de Dados");
    await descricaoInput.fill(
      "Este quiz aborda conceitos fundamentais sobre estruturas de dados, incluindo pilhas, filas e árvores binárias de busca.",
    );
  });

  await test.step("Submit the new quiz", async () => {
    const confirmarBtn = page.getByText("Confirmar", { exact: true });
    await confirmarBtn.click();
  });

  await test.step("Verify quiz creation success via redirect", async () => {
    await expect(page).toHaveURL(/\/dashboard\/quizzes\/[a-fA-F0-9-]{36}$/);
  });

  await test.step("Fill question text", async () => {
    const questionTextarea = page.getByTestId("question-textarea");
    await expect(questionTextarea).toBeVisible();
    await questionTextarea.fill("O que é uma fila (queue) em estrutura de dados?");
  });

  await test.step("Fill in alternatives", async () => {
    const alt0 = page.getByTestId("answer-0");

    const alt1 = page.getByTestId("answer-1");
    const alt2 = page.getByTestId("answer-2");
    const alt3 = page.getByTestId("answer-3");

    await alt0.fill("Uma estrutura FIFO");
    await alt1.fill("Uma estrutura LIFO");
    await alt2.fill("Uma árvore de decisão");
    await alt3.fill("Uma lista circular");
  });

  await test.step("Select the correct answer", async () => {
    const correctBtn = page.getByLabel("Marcar resposta 1 como correta");
    await correctBtn.click();
  });

  await test.step("Change time limit", async () => {
    const timeInput = page.getByLabel("Tempo limite da questão");
    await timeInput.fill("45");
  });

  await test.step("Save updated quiz", async () => {
    const salvarBtn = page.getByTestId("salvar-quiz");
    await salvarBtn.click();
  });

  await test.step("Confirm redirection to quizzes page", async () => {
    await expect(page).toHaveURL("/dashboard/quizzes");
  });
});
