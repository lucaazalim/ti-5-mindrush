import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindRush",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.className} scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--color-ice)]">
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
