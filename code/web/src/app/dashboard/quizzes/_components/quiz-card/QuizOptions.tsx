"use client";

import { useState } from "react";
import { Pencil, Settings2, TextCursorInput, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import DeleteQuizModal from "./DeleteQuizModal";
import RenameQuizModal from "./RenameQuizModal";
import type { Quiz } from "~/lib/types";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/lib/constants";

export default function QuizOptions({ id, title, description }: Quiz) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Settings2 size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Opções do quiz</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(ROUTES.QUIZ(id))}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIsRenameDialogOpen(true);
            }}
          >
            <TextCursorInput className="mr-2 h-4 w-4" />
            Renomear
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer focus:bg-red-50 focus:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameQuizModal
        open={isRenameDialogOpen}
        setIsRenameDialogOpen={setIsRenameDialogOpen}
        id={id}
        title={title}
        description={description}
      />

      <DeleteQuizModal
        open={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        id={id}
        title={title}
      />
    </>
  );
}
