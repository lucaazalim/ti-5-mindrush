"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { MATCH_STATUSES_NAMES, statusColorMap } from "~/lib/constants";
import { MatchWithQuizTitle } from "~/lib/types";

export const columns: ColumnDef<MatchWithQuizTitle>[] = [
  {
    accessorKey: "quizTitle",
    header: "Quiz",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusColorMap[status]}>
          {MATCH_STATUSES_NAMES[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "endedAt",
    header: "Finalizado em",
    cell: ({ row }) => {
      const date: Date | null = row.original.endedAt;
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
