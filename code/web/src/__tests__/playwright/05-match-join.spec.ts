import { expect, request, test } from "@playwright/test";
import { addSessionTokenCookie } from "./utils";

test("Participant join match", async ({ page, context }) => {
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

  let pinValue: string | null = null;

  await test.step("Expect to see match PIN", async () => {
    pinValue = await page.locator("#pin-value").textContent();
    expect(pinValue).toBeTruthy();
    expect(pinValue).toHaveLength(6);
  });

  await test.step("Create participant", async () => {
    const apiContext = await request.newContext();

    const response = await apiContext.post(`/api/matches/${pinValue}/participants`, {
      data: {
        nickname: "Richard",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    expect(response.ok()).toBeTruthy();
  });



  await test.step("Create multiple participants", async () => {

    await page.waitForTimeout(1000);
    const nicknames = ["Alice", "Bob"];
    const apiContext = await request.newContext();

    for (const nick of nicknames) {
      const response = await apiContext.post(`/api/matches/${pinValue}/participants`, {
        data: { 
          nickname: nick
         },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      expect(response.ok()).toBeTruthy();
      await page.waitForTimeout(1000);

    }

  });


  await test.step("Fail to create participant with duplicate nickname", async () => {

    const apiContext = await request.newContext();
  
    const response = await apiContext.post(`/api/matches/${pinValue}/participants`, {
      data: {
        nickname: "Richard", 
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  

    expect(response.status()).toBe(400); 

  });


  await page.pause();

  await test.step("Expect to see participants nickname", async () => {
    await expect(page.getByText("Richard")).toBeVisible();
    await expect(page.getByText("Alice")).toBeVisible();
    await expect(page.getByText("Bob")).toBeVisible();
  });

});
