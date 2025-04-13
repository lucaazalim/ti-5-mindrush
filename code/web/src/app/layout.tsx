import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "sonner";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindRush",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth antialiased`}>
      <body className="bg-[var(--color-ice)]">
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
