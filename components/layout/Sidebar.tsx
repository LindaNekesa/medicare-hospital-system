import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard" className="hover:bg-gray-700 px-4 py-2 rounded transition">
          Dashboard
        </Link>
        <Link href="/patients" className="hover:bg-gray-700 px-4 py-2 rounded transition">
          Patients
        </Link>
        <Link href="/appointments" className="hover:bg-gray-700 px-4 py-2 rounded transition">
          Appointments
        </Link>
        <Link href="/settings" className="hover:bg-gray-700 px-4 py-2 rounded transition">
          Settings
        </Link>
      </nav>
    </aside>
  );
}