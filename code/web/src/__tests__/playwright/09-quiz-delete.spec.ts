import { expect, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("Delete quiz from the dashboard", async ({ page, context }) => {
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

  await test.step("Click on delete quiz option", async () => {
    await page.getByRole("menuitem", { name: "Excluir" }).click();
  });

  await test.step("Confirm deletion", async () => {
    await page.getByRole("button", { name: "Excluir" }).click();
  });

  await test.step("Verify success message", async () => {
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Quiz excluído com sucesso")).toBeVisible();
  });
});
