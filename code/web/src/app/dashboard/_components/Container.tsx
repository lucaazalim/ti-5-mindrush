import { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export default function Container({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-3xl border-2 bg-background p-5", className)} {...props}>
      {children}
    </div>
  );
}
