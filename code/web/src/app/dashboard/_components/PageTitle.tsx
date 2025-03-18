import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export default function PageTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn(className, "font-semibold text-2xl")} {...props}>
      {children}
    </h1>
  );
}
