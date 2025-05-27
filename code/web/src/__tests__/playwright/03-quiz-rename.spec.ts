import { expect, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("Rename quiz from the dashboard", async ({ page, context }) => {
  await test.step("Authenticate user via session cookie", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Navigate to quizzes dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");

    const gridContainer = page.locator("div.grid.mt-8 >> visible=true");

    const quizCards = gridContainer.locator("h3");
    await expect(quizCards.first()).toBeVisible();
  });

  await test.step("Open quiz options", async () => {
    const quizOptionsButton = page
      .locator("button", { has: page.locator("span.sr-only", { hasText: "Opções do quiz" }) })
      .first();

    await expect(quizOptionsButton).toBeVisible();
    await quizOptionsButton.click();

    await expect(page.getByRole("menuitem", { name: "Renomear" })).toBeVisible();
  });

  await test.step("Click on rename quiz option", async () => {
    await page.getByRole("menuitem", { name: "Renomear" }).click();

    await expect(page.getByLabel("Título")).toBeVisible();
    await expect(page.getByLabel("Descrição")).toBeVisible();
  });

  await test.step("Edit the title and description", async () => {
    const titleInput = page.getByLabel("Título");
    const descriptionInput = page.getByLabel("Descrição");

    const oldTitle = await titleInput.inputValue();
    const oldDescription = await descriptionInput.inputValue();

    const newTitle = oldTitle + " atualizado";
    const newDescription = oldDescription + " atualizado";

    await titleInput.fill(newTitle);
    await descriptionInput.fill(newDescription);

    const saveButton = page.getByRole("button", { name: "Salvar" });
    await expect(saveButton).toBeEnabled();
  });

  await test.step("Submit the form", async () => {
    await page.getByRole("button", { name: "Salvar" }).click();
  });

  await test.step("Verify success message and updated data", async () => {
    await expect(page.locator("text=Quiz renomeado com sucesso")).toBeVisible();

    await expect(page.locator("h3", { hasText: "atualizado" }).first()).toBeVisible();
  });
});
