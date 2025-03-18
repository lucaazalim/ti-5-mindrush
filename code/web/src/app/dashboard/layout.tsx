import "~/styles/globals.css";

import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <nav className="bg-blue-500">
        <div className="px-10 py-5 max-w-5xl mx-auto">
            <Image
                src="/logo.png"
                alt="Logo do MindRush"
                width={100}
                height={100}
            />
        </div>
      </nav>
      <main className="p-10 max-w-5xl mx-auto">
          {children}
      </main>
    </div>
  );
}
