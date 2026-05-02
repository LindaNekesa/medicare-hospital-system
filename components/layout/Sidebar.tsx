"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Appointments", href: "/appointments" },
  { name: "Medical Records", href: "/records" },
  { name: "Profile", href: "/profile" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64 bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">Medicare</h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-3 py-2 rounded-md text-sm transition",
              pathname === link.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
