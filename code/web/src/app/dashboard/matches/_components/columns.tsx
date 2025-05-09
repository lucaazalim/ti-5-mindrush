"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { MATCH_STATUSES_NAMES, ROUTES, MATCH_STATUS_BADGE_VARIANTS } from "~/lib/constants";
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
        <Badge variant={MATCH_STATUS_BADGE_VARIANTS[status]}>
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
  },
  {
    header: " ",
    cell: ({ row }) => {
      return (
        <Link href={ROUTES.MATCH(row.original.id)}>
          <Eye strokeWidth={1.5}/>
        </Link>
      );
    },
  },
];
