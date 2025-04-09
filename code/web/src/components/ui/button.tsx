import * as React from "react"
import {Slot, Slottable} from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import {LoaderCircle} from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 data-[loader=true]:[&>svg]:!text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 data-[loader=true]:[&>svg]:!text-destructive-foreground",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground data-[loader=true]:[&>svg]:!text-accent-foreground",
        secondary:
          "bg-secondary text-background shadow-sm hover:bg-secondary/80 data-[loader=true]:[&>svg]:!text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground data-[loader=true]:[&>svg]:!text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline data-[loader=true]:[&>svg]:!text-primary",
      },
      size: {
        default: "rounded-3xl py-3 px-8",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",

      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            disabled,
            loading = false,
            children,
            asChild = false,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(
                    buttonVariants({
                        variant,
                        size,
                        className,
                    }),
                    {
                        "select-none text-transparent": loading,
                    },
                )}
                ref={ref}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <LoaderCircle data-loader={true} className="absolute animate-spin" />}
                <Slottable>{children}</Slottable>
            </Comp>
        );
    },
);

Button.displayName = "Button";

export { Button, buttonVariants };
