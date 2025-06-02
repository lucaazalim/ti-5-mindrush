import { expect, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("educador visualiza histórico de partidas finalizadas", async ({ page, context }) => {
  await test.step("Autenticar educador com cookie de sessão", async () => {
    await addSessionTokenCookie(context);
  });

  await test.step("Acessar página de quizzes do dashboard", async () => {
    await page.goto("/dashboard/quizzes");
    await expect(page).toHaveURL("/dashboard/quizzes");
  });

  await test.step('Verificar se botão "Histórico de Partidas" está visível e funcional', async () => {
    const historicoBtn = page.getByRole("button", { name: /Histórico de Partidas/i });
    await expect(historicoBtn).toBeVisible();
    await historicoBtn.click();
  });

  await test.step("Verificar redirecionamento para a página de histórico", async () => {
    await expect(page).toHaveURL("/dashboard/matches");
    await expect(page.getByRole("heading", { name: /Histórico de Partidas/i })).toBeVisible();
  });

  await test.step("Verificar presença da tabela de partidas com colunas esperadas", async () => {
    const table = page.locator("table");
    await expect(table).toBeVisible();
    await expect(table.getByText(/Título do Quiz/i)).toBeVisible();
    await expect(table.getByText(/Status/i)).toBeVisible();
    await expect(table.getByText(/Finalizada em/i)).toBeVisible();
  });

  await test.step("Verificar que o ícone de olho está presente em cada linha", async () => {
    const eyeIcons = page.locator("a[href^='/dashboard/matches/'] >> svg.lucide-eye");
    await expect(eyeIcons.first()).toBeVisible();
  });

  await test.step("Verificar se botão de voltar está presente e funcional", async () => {
    const voltarButton = page.getByRole("button", { name: /voltar/i });
    await expect(voltarButton).toBeVisible();
  });

  await test.step("Verificar redirecionamento para página de relatório ao clicar no ícone de olho", async () => {
    const primeiraLinhaLink = page.locator("a[href^='/dashboard/matches/']").first();
    const href = await primeiraLinhaLink.getAttribute("href");

    await primeiraLinhaLink.click();
    await expect(page).toHaveURL(href!);
  });
});
