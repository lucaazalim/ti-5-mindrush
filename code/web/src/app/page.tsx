import Link from "next/link";
import SignInButton from "./_components/SignInButton";

export default async function HomePage() {
  return (
    <main>
      <p>Mindrush!</p>
      <SignInButton />
    </main>
  );
}
