"use client";

import { useState } from "react";
import { Settings2, Pencil, Trash2, Delete } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import DeleteQuizModal from "./DeleteQuizModal";

export default function QuizOptions({ quizId }: { quizId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-5 top-4">
          <Settings2 size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Opções do quiz</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-red-50 focus:text-red-500"
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash2 />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteQuizModal
        open={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        quizId={quizId}
      />
    </>
  );
}
