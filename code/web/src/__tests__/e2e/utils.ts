import { BrowserContext } from "@playwright/test";

export const BASE_URL = "http://localhost:3000";

export async function addSessionTokenCookie(context: BrowserContext) {
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: "365636bc-fd6d-4d5f-a688-8af780dc3b05",
      domain: "localhost",
      path: "/",
      httpOnly: true, // set to true if the cookie is HttpOnly
      secure: false, // set to true if running over HTTPS
      sameSite: "Lax", // or "Strict" / "None"
    },
  ]);
}