import { expect, request, test as setup } from "@playwright/test";
import { BASE_URL } from "./utils";

setup("reset and seed database", async ({}) => {
  const apiContext = await request.newContext();
  const response = await apiContext.get(`${BASE_URL}/api/reset-and-seed`);
  expect(response.ok()).toBeTruthy();
  console.log(await response.text());
});
