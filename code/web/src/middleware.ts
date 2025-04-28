import { auth } from "~/server/auth";
import { ROUTES } from "~/lib/constants";
import { NextResponse } from "next/server";
import { type Route } from "next";

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

  // CORS
  const response = NextResponse.next();

  if (matchesRoute(ROUTES.API)) {
    response.headers.set("Access-Control-Allow-Origin", "*");

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
    );

    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return response;
});

export const config = {
  runtime: "nodejs",
};
