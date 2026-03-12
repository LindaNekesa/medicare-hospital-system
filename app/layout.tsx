// app/layout.tsx
import { ReactNode } from "react";
import "../styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Example Navbar component
const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Medicare Hospital System</h1>
      <ul className="flex space-x-4">
        <li className="hover:text-gray-200 cursor-pointer">Dashboard</li>
        <li className="hover:text-gray-200 cursor-pointer">Patients</li>
        <li className="hover:text-gray-200 cursor-pointer">Appointments</li>
        <li className="hover:text-gray-200 cursor-pointer">Settings</li>
      </ul>
    </nav>
  );
};

export const metadata = {
  title: "Medicare Hospital System",
  description: "Hospital management system built with Next.js, React, TypeScript, and Tailwind CSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}