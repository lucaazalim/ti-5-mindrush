import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { BadgeCheck, ChevronsUpDown } from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import LogOutDropdownMenuItem from "~/app/dashboard/_components/LogOutDropdownMenuItem";
import { auth } from "~/server/auth";

export default async function Header() {
    const session = await auth();

    if (!session) {
        return null;
    }

    const { user } = session;

    const initials: string = (() => {
        const parts: string[] = session.user.name?.trim().split(" ") ?? [];

        if (parts.length >= 2) {
            return parts
                .map((name: string) => name[0])
                .join("")
                .toUpperCase();
        }

        if (parts.length === 1) {
            const firstWord = parts[0] ?? "";
            const firstChar = firstWord[0] ?? "";
            const secondChar = firstWord[1] ?? firstChar;
            if (firstChar) {
                return (firstChar + secondChar).toUpperCase();
            }
        }

        return "??";
    })();

    return (
        <nav className="bg-primary">
            <div className="mx-auto flex max-w-5xl flex-row justify-between p-5">
                <div className="my-auto">
                    <Image
                        src="/logo.png"
                        alt="Logo do MindRush"
                        width={100}
                        height={0}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex cursor-pointer select-none flex-row items-center gap-2 rounded-lg bg-background/10 p-2 transition-colors hover:bg-background/20">
                            <Avatar className="size-8">
                                <AvatarImage
                                    src={user.image ?? undefined}
                                    alt={user.name ?? undefined}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-background">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs text-background">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-background" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={"bottom"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8">
                                    <AvatarImage
                                        src={user.image ?? undefined}
                                        alt={user.name ?? undefined}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Sua conta
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <LogOutDropdownMenuItem />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}