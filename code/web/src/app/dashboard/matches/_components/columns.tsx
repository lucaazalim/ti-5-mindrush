"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MatchWithQuizTitle } from "~/lib/types";

export const columns: ColumnDef<MatchWithQuizTitle>[] = [
  {
    accessorKey: "quizTitle",
    header: "Quiz",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
