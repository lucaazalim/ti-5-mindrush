import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export default function PageTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn(className, "text-2xl font-semibold")} {...props}>
      {children}
    </h1>
  );
}
