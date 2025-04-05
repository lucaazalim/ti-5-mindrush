export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  QUIZZES: "/dashboard/quizzes",
  QUIZ: (id: string) => `/dashboard/quizzes/${id}`,
  MATCHES: "/dashboard/matches",
  MATCH: (id: string) => `/dashboard/matches/${id}`,
};
