import { Circle, Diamond, LucideIcon, Square, Triangle } from "lucide-react";
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

export const MATCH_STATUSES_NAMES: Record<(typeof MATCH_STATUSES)[number], string> = {
  WAITING: "Aguardando",
  RUNNING: "Em andamento",
  ENDED: "Finalizada",
};

export const statusColorMap: Record<keyof typeof MATCH_STATUSES_NAMES, "warning" | "success" | "outline"> = {
  WAITING: "outline",
  RUNNING: "warning",
  ENDED: "success",
};

export const QUESTION_VISUALS: {
  icon: LucideIcon;
  colorClassName: string;
  cssVariable: `hsl(var(${string}))`;
}[] = [
  { icon: Triangle, colorClassName: "bg-red-500", cssVariable: "hsl(var(--first-alternative))" },
  { icon: Diamond, colorClassName: "bg-blue-500", cssVariable: "hsl(var(--second-alternative))" },
  { icon: Circle, colorClassName: "bg-yellow-500", cssVariable: "hsl(var(--third-alternative))" },
  { icon: Square, colorClassName: "bg-green-500", cssVariable: "hsl(var(--fourth-alternative))" },
];
