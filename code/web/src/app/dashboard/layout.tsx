import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import ThemeProviderWrapper from "./_components/ThemeProviderWrapper";
import Header from "./_components/header/Header";

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
      <body className="bg-[var(--color-ice)] dark:bg-black">
        <ThemeProviderWrapper>
          <Header />
          {children}
        </ThemeProviderWrapper>
        <Toaster richColors />
      </body>
    </html>
  );
}
