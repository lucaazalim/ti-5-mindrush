import { expect, test } from "@playwright/test";

test("has h1", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: "0176122b-710f-4202-98eb-80010467ef85",
      domain: "localhost",
      path: "/",
      httpOnly: true, // set to true if the cookie is HttpOnly
      secure: false, // set to true if running over HTTPS
      sameSite: "Lax", // or "Strict" / "None"
    },
  ]);

  await page.goto("http://localhost:3000/dashboard/quizzes");

  // Expect page to contain an h1 with the text "Seus quizzes"

  const h1 = page.locator("h1");
  await expect(h1).toHaveText("Seus quizzes");

  await page.getByText("Criar quiz", { exact: true }).click();
  await page.getByLabel("Título").fill("Estruturas de Dados");
  await page
    .getByLabel("Descrição")
    .fill(
      "Este quiz aborda conceitos fundamentais sobre estruturas de dados, incluindo pilhas, filas e árvores binárias de busca.",
    );
  await page.getByText("Confirmar").click();
  await page.pause();
});
