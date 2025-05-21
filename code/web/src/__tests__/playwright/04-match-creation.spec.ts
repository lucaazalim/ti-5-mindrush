import { expect, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("Create match from the dashboard", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");
  });

  await test.step("Click create match button", async () => {
    await page.getByRole("button", { name: "Criar partida" }).first().click();
  });

  await test.step("Expect redirection to match page", async () => {
    await expect(page).toHaveURL(/\/dashboard\/matches\/[a-fA-F0-9-]{36}$/);
  });

  await test.step("Verify success message", async () => {
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Partida criada com sucesso!")).toBeVisible();
  });

});
