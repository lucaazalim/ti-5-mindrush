"use client";

import { useState } from "react";
import { Settings2, Pencil, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import DeleteQuizModal from "./DeleteQuizModal";
import EditQuizModal from "./EditQuizModal";

interface QuizOptionsProps {
  id: string;
  title: string;
  description: string;
}

export default function QuizOptions({ id, title, description }: QuizOptionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-5 top-4">
          <Settings2 size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Opções do quiz</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-red-50 focus:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditQuizModal
        open={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
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
