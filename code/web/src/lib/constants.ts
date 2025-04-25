import { Uuid } from "./types";

export type Route = `/${string}`;

export const ROUTES: {
  API: Route;
  HOME: Route;
  DASHBOARD: Route;
  QUIZZES: Route;
  QUIZ: (id: Uuid) => Route;
  MATCHES: Route;
  MATCH: (id: Uuid) => Route;
} = {
  API: "/api",
  HOME: "/",
  DASHBOARD: "/dashboard",
  QUIZZES: "/dashboard/quizzes",
  QUIZ: (id: Uuid) => `/dashboard/quizzes/${id}`,
  MATCHES: "/dashboard/matches",
  MATCH: (id: Uuid) => `/dashboard/matches/${id}`,
};

export const QUESTION_TYPES = ["QUIZ", "TRUE_OR_FALSE"] as const;

export const MATCH_STATUSES = ["WAITING", "RUNNING", "ENDED"] as const;

export const QUESTION_TYPES_NAMES: Record<(typeof QUESTION_TYPES)[number], string> = {
  QUIZ: "Quiz",
  TRUE_OR_FALSE: "Verdadeiro ou falso",
};
