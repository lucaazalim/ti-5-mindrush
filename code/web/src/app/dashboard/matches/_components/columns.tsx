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
  {
    accessorKey: "finishedAt",
    header: "Finalizado em",
    cell: ({ row }) => {
      const date: Date | null = row.original.finishedAt;
      return date
        ? new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(date))
        : "-";
    },
  }
];
