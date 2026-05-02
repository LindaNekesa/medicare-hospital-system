import { ReactNode } from "react";
import "../styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Medicare Hospital System",
    template: "%s | Medicare Hospital",
  },
  description:
    "Medicare Hospital — integrated hospital management system for clinical staff, patients, and administration.",
  keywords: ["hospital", "medicare", "medical", "healthcare", "hospital management"],
  authors: [{ name: "Medicare Hospital" }],
  creator: "Medicare Hospital System",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Medicare Hospital System",
    description: "Integrated hospital management system",
    type: "website",
    locale: "en_KE",
    siteName: "Medicare Hospital",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <body className="bg-gray-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}