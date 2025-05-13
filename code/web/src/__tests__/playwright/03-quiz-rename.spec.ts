import { expect, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("Rename quiz from the dashboard", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");
  });

  await test.step("Open quiz options", async () => {
    await page.getByRole("button", { name: "Opções do quiz" }).first().click();
  });

  await test.step("Click on rename quiz option", async () => {
    await page.getByRole("menuitem", { name: "Renomear" }).click();
  });

  await test.step("Fill in the form", async () => {
    await page.getByLabel("Título").fill("Novo título do quiz");
    await page.getByLabel("Descrição").fill("Nova descrição do quiz");
  });

  await test.step("Submit the form", async () => {
    await page.getByRole("button", { name: "Salvar" }).click();
  });

  await test.step("Verify success message", async () => {
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Quiz renomeado com sucesso")).toBeVisible();
  });
});
