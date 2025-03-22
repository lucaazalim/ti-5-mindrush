import { Button } from "~/components/ui/button";
import { signIn } from "~/server/auth";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button className="bg-primary text-[15px]" size="default" type="submit">Acessar</Button>
    </form>
  );
}
