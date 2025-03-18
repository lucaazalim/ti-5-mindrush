"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {signOut} from "next-auth/react";

export default function LogOutDropdownMenuItem() {
  return (
    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
      <LogOut />
      Sair
    </DropdownMenuItem>
  );
}
