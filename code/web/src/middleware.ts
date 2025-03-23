import { auth } from "~/server/auth";
import { ROUTES } from "~/lib/constants";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith(ROUTES.DASHBOARD) && !req.auth) {
    const homeUrl = new URL(ROUTES.HOME, req.nextUrl.origin);
    return Response.redirect(homeUrl);
  }
});

export const config = {
  runtime: "nodejs",
};
