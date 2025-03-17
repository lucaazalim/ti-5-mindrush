import { signIn } from "~/server/auth";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Signin</button>
    </form>
  );
}
