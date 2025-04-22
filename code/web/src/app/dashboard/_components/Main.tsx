import { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export default function Main({ children, className }: HTMLAttributes<HTMLDivElement>) {
  return <main className={cn("mx-auto max-w-5xl px-5 py-10", className)}>{children}</main>;
}
