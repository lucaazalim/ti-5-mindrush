import { Circle, Diamond, LucideIcon, Square, Triangle } from "lucide-react";
import { Uuid } from "./parsers";

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

export const QUIZ_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export const QUIZ_LANGUAGES = ["PORTUGUESE", "ENGLISH", "SPANISH"] as const;

export const MATCH_STATUSES = ["WAITING", "RUNNING", "ENDED"] as const;

export const QUESTION_TYPES_NAMES: Record<(typeof QUESTION_TYPES)[number], string> = {
  QUIZ: "Quiz",
  TRUE_OR_FALSE: "True or False",
};

export const QUIZ_DIFFICULTY_NAMES: Record<(typeof QUIZ_DIFFICULTIES)[number], string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export const QUIZ_LANGUAGE_NAMES: Record<(typeof QUIZ_LANGUAGES)[number], string> = {
  ENGLISH: "English",
  PORTUGUESE: "Portuguese",
  SPANISH: "Spanish",
};

export const MATCH_STATUSES_NAMES: Record<(typeof MATCH_STATUSES)[number], string> = {
  WAITING: "Waiting",
  RUNNING: "Running",
  ENDED: "Ended",
};

export const MATCH_STATUS_BADGE_VARIANTS: Record<
  keyof typeof MATCH_STATUSES_NAMES,
  "warning" | "success" | "outline"
> = {
  WAITING: "outline",
  RUNNING: "warning",
  ENDED: "success",
};

export const QUESTION_ALTERNATIVES_STYLING: {
  icon: LucideIcon;
  colorClassName: string;
  cssVariable: `hsl(var(${string}))`;
}[] = [
  { icon: Triangle, colorClassName: "bg-red-500", cssVariable: "hsl(var(--first-alternative))" },
  { icon: Diamond, colorClassName: "bg-blue-500", cssVariable: "hsl(var(--second-alternative))" },
  { icon: Circle, colorClassName: "bg-yellow-500", cssVariable: "hsl(var(--third-alternative))" },
  { icon: Square, colorClassName: "bg-green-500", cssVariable: "hsl(var(--fourth-alternative))" },
];

export const TEST_SESSION_TOKEN = "365636bc-fd6d-4d5f-a688-8af780dc3b05";

export const COLORS: Record<string, string> = {
  "bg-red-500": "#ef4444",
  "bg-blue-500": "#3b82f6",
  "bg-yellow-500": "#eab308",
  "bg-green-500": "#22c55e",
};
