"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/lib/constants";

export default function SignInButton() {
  return (
    <Button
      className="bg-primary text-[15px]"
      size="default"
      type="button"
      onClick={() => signIn("google", { callbackUrl: ROUTES.DASHBOARD })}
    >
      Access
    </Button>
  );
}
