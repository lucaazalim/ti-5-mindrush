import "~/styles/globals.css";
import Header from "~/app/dashboard/_components/Header";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
