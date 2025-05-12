import { expect, test } from "@playwright/test";
import { addSessionTokenCookie, BASE_URL } from "./utils";

test("create a new quiz from the dashboard", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto(`${BASE_URL}/dashboard/quizzes`);
    await expect(page).toHaveURL(`${BASE_URL}/dashboard/quizzes`);
    await expect(page.locator("h1")).toHaveText("Seus quizzes");
  });

  await test.step("Open quiz creation form", async () => {
    const criarQuizBtn = page.getByText("Criar quiz", { exact: true });
    await expect(criarQuizBtn).toBeVisible();
    await criarQuizBtn.click();
  });

  await test.step("Fill in quiz details", async () => {
    const tituloInput = page.getByLabel("Título");
    const descricaoInput = page.getByLabel("Descrição");

    await expect(tituloInput).toBeVisible();
    await expect(descricaoInput).toBeVisible();

    await tituloInput.fill("Estruturas de Dados");
    await descricaoInput.fill(
      "Este quiz aborda conceitos fundamentais sobre estruturas de dados, incluindo pilhas, filas e árvores binárias de busca.",
    );
  });

  await test.step("Submit the new quiz", async () => {
    const confirmarBtn = page.getByText("Confirmar", { exact: true });
    await expect(confirmarBtn).toBeVisible();
    await confirmarBtn.click();
  });

  await test.step("Verify quiz creation success", async () => {
    await expect(page).toHaveURL(/\/dashboard\/quizzes\/[a-fA-F0-9-]{36}$/);
    await expect(page.locator("text=Quiz criado com sucesso")).toBeVisible();
  });
});
