"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import StaffEditForm from "./StaffEditForm"
import Modal from "../ui/Modal"

export default function StaffTable() {
  const [editStaff, setEditStaff] = useState<any | null>(null)

  const { data: staff = [], isLoading } = useQuery(["staff"], async () => {
    const res = await fetch("/api/staff")
    return res.json()
  })

  if (isLoading) return <p>Loading staff...</p>

  return (
    <>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s: any) => (
            <tr key={s.id} className="border-b">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.email}</td>
              <td className="p-2">{s.role}</td>
              <td className="p-2">{s.phone}</td>
              <td className="p-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => setEditStaff(s)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editStaff && (
        <Modal isOpen={!!editStaff} onClose={() => setEditStaff(null)}>
          <StaffEditForm staff={editStaff} />
        </Modal>
      )}
    </>
  )
}