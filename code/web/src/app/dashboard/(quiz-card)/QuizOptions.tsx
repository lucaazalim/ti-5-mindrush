"use client";

import { useState } from "react";
import { Settings2, Pencil, Trash2, TextCursorInput } from "lucide-react";
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

interface QuizOptionsProps {
  id: string;
  title: string;
  description: string;
}

export default function QuizOptions({
  id,
  title,
  description,
}: QuizOptionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Settings2 size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Opções do quiz</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              window.location.href = `/dashboard/manual?id=${id}`;
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {setIsRenameDialogOpen(true)}}
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
