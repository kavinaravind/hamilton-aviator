import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/lib/trpc/react";

import { ThemeProvider, ThemeToggle } from "@hamilton/ui/components/ui/theme";
import { Toaster } from "@hamilton/ui/components/ui/toast";
import { cn } from "@hamilton/ui/lib/utils/index";

import "@/app/globals.css";

import { env } from "@/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://aviator.hamilton.ai"
      : "http://localhost:3000",
  ),
  title: "Hamilton Aviator",
  description:
    "A tool for pilots to log flights, track duty hours, manage maintenance records, and generate FAA-ready reports.",
  openGraph: {
    title: "Hamilton Aviator",
    description:
      "A tool for pilots to log flights, track duty hours, manage maintenance records, and generate FAA-ready reports.",
    url: "https://aviator.hamilton.ai",
    siteName: "Hamilton Aviator",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
