import { test, expect } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("start match from dashboard", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");
  });

  await test.step("Click track match button", async () => {
    await page.getByRole("button", { name: "Acompanhar partida" }).first().click();
  });

  await test.step("Expect redirection to match page", async () => {
    await expect(page).toHaveURL(/\/dashboard\/matches\/[a-fA-F0-9-]{36}$/);
  });

  await test.step("Click start match button", async () => {
    const button = page.getByRole("button", { name: /Iniciar partida/i });

    // Garante que o botão está habilitado (deve ter participantes no match store)
    await expect(button).toBeEnabled();

    // Clica para iniciar partida
    await button.click();

    // Espera por efeito da mutation (toast, loading, etc)
    await page.waitForTimeout(500); // ou aguarde um seletor

  });
});
