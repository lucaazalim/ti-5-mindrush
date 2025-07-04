import { type Route } from "next";
import { NextResponse } from "next/server";
import { auth } from "src/lib/auth";
import { ROUTES } from "~/lib/constants";

export default auth((request) => {
  // This always return the pathname WITH leading slash and WITHOUT trailing slash.
  const pathname = request.nextUrl.pathname;

  // This makes sure "/api" route does not match "/apiculture" pathname, for example.
  function matchesRoute(route: Route) {
    return (pathname + "/").startsWith(route + "/");
  }

  // Redirect to home if the user is not authenticated and trying to access the dashboard
  if (matchesRoute(ROUTES.DASHBOARD) && !request.auth) {
    const homeUrl = new URL(ROUTES.HOME, request.nextUrl.origin);
    return Response.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  runtime: "nodejs",
};
