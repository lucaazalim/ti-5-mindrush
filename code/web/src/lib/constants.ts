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

export const QUESTION_TYPES = ["QUIZ", "TRUE_OR_FALSE"] as const;

export const QUESTION_TYPES_NAMES: Record<
  (typeof QUESTION_TYPES)[number],
  string
> = {
  QUIZ: "Quiz",
  TRUE_OR_FALSE: "Verdadeiro ou falso",
};
