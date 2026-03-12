import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Medicare Hospital System</h1>

      <ul className="hidden md:flex space-x-6">
        <li>
          <Link href="/dashboard" className="hover:text-gray-200 transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/patients" className="hover:text-gray-200 transition">
            Patients
          </Link>
        </li>
        <li>
          <Link href="/appointments" className="hover:text-gray-200 transition">
            Appointments
          </Link>
        </li>
        <li>
          <Link href="/settings" className="hover:text-gray-200 transition">
            Settings
          </Link>
        </li>
      </ul>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button className="focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}