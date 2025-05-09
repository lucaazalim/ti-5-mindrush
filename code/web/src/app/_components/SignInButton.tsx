import { Button } from "~/components/ui/button";
import { signIn } from "src/lib/auth";
import { ROUTES } from "~/lib/constants";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: ROUTES.DASHBOARD,
        });
      }}
    >
      <Button className="bg-primary text-[15px]" size="default" type="submit">
        Acessar
      </Button>
    </form>
  );
}
