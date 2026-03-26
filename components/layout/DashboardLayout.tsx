"use client"

import React from "react"
import Link from "next/link"

type Props = {
  children: React.ReactNode
  userName: string
  role: string
}

export default function DashboardLayout({ children, userName, role }: Props) {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">

        <h2 className="text-xl font-bold mb-6">Medicare HMS</h2>

        <nav className="flex flex-col gap-2">

          <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-gray-200">
            Home
          </Link>

          {role !== "PATIENT" && (
            <>
              <Link href="/dashboard/patients" className="px-3 py-2 rounded hover:bg-gray-200">
                Patients
              </Link>

              <Link href="/dashboard/appointments" className="px-3 py-2 rounded hover:bg-gray-200">
                Appointments
              </Link>

              <Link href="/dashboard/tasks" className="px-3 py-2 rounded hover:bg-gray-200">
                Tasks
              </Link>

              <Link href="/dashboard/labs" className="px-3 py-2 rounded hover:bg-gray-200">
                Labs
              </Link>
            </>
          )}

          {role === "PATIENT" && (
            <>
              <Link href="/dashboard/my-appointments" className="px-3 py-2 rounded hover:bg-gray-200">
                My Appointments
              </Link>

              <Link href="/dashboard/my-labs" className="px-3 py-2 rounded hover:bg-gray-200">
                My Labs
              </Link>
            </>
          )}

          {/* ADMIN SETTINGS */}
          {role === "ADMIN" && (
            <Link
              href="/dashboard/settings"
              className="px-3 py-2 rounded hover:bg-gray-200"
            >
              Settings
            </Link>
          )}

        </nav>

        {/* User info */}
        <div className="mt-auto pt-6 border-t">
          <span className="text-sm text-gray-500">
            Logged in as: {userName}
          </span>
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>

    </div>
  )
}