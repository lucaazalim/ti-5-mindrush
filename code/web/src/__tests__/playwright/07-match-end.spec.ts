import { test, expect } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("educator ends an ongoing match", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");
  });

  await test.step("Click 'Acompanhar partida' to enter match page", async () => {
    await page.getByRole("button", { name: "Acompanhar partida" }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/matches\/[a-fA-F0-9-]{36}$/);
  });

  await test.step("Start match if not already started", async () => {
    const startButton = page.getByRole("button", { name: /Iniciar partida/i });
    if (await startButton.isVisible()) {
      await expect(startButton).toBeEnabled();
      await startButton.click();
      await page.waitForTimeout(500);
    }
  });

  await test.step("Click 'Encerrar partida' button", async () => {
    const endButton = page.getByRole("button", { name: /Encerrar partida/i });
    await expect(endButton).toBeVisible();
    await expect(endButton).toBeEnabled();
    await endButton.click();
  });

  await test.step("Confirm match ended successfully", async () => {
    const successMessage = page.getByText(/Partida encerrada!/i);
    await expect(successMessage).toBeVisible();
  });
});
