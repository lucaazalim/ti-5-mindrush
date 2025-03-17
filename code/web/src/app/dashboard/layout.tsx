import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <nav className="bg-blue-500 p-5">
        <Image
          src="/logo.png"
          alt="Logo do MindRush"
          width={100}
          height={100}
        />
      </nav>
      {children}
    </div>
  );
}
