import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: "Medicare Hospital System",
  description: "Integrated Hospital Management System — Nairobi, Kenya",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: "Medicare Hospital System",
    description: "Integrated Hospital Management System",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
