export type Route = `/${string}`;

export const ROUTES: {
  API: Route;
  HOME: Route;
  DASHBOARD: Route;
  QUIZZES: Route;
  QUIZ: (id: string) => Route;
  MATCHES: Route;
  MATCH: (id: string) => Route;
} = {
  API: "/api",
  HOME: "/",
  DASHBOARD: "/dashboard",
  QUIZZES: "/dashboard/quizzes",
  QUIZ: (id: string) => `/dashboard/quizzes/${id}`,
  MATCHES: "/dashboard/matches",
  MATCH: (id: string) => `/dashboard/matches/${id}`,
};
