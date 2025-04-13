"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

type BackButtonProps = {
  className?: string;
  href?: string;
};

export default function BackButton({ href, className }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (window.history.length > 1) {
          router.back(); // Go back to the previous page
        } else if (href) {
          router.push(href); // Fallback to provided href
        } else {
          router.push("/"); // Fallback to home or default page
        }
      }}
      className={cn(
        className,
        "flex flex-row items-center gap-1 border-b-2 border-primary text-primary hover:brightness-125",
      )}
    >
      <ArrowLeft className="size-4" />
      <span className="text-sm font-semibold">VOLTAR</span>
    </button>
  );
}
