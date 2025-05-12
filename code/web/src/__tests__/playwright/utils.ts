import { BrowserContext } from "@playwright/test";
import { TEST_SESSION_TOKEN } from "~/lib/constants";

export const BASE_URL = "http://localhost:3000";

export async function addSessionTokenCookie(context: BrowserContext) {
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: TEST_SESSION_TOKEN,
      domain: "localhost",
      path: "/",
      httpOnly: true, // set to true if the cookie is HttpOnly
      secure: false, // set to true if running over HTTPS
      sameSite: "Lax", // or "Strict" / "None"
    },
  ]);
}
