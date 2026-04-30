"use client"

import { useState, useEffect, useCallback } from "react"
import StaffEditForm from "./StaffEditForm"
import Modal from "./ui/Modal"

type Staff = {
  id: number
  name: string
  email: string
  role: string
  phone: string
}

export default function StaffTable() {
  const [staff, setStaff]       = useState<Staff[]>([])
  const [loading, setLoading]   = useState(true)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/staff")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setStaff(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <p className="text-gray-500 py-4">Loading staff...</p>

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {["Name", "Email", "Role", "Phone", "Actions"].map(h => (
                <th key={h} className="p-3 border text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No staff found</td></tr>
            ) : staff.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900">{s.name}</td>
                <td className="p-3 text-gray-600">{s.email}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{s.role}</span>
                </td>
                <td className="p-3 text-gray-600">{s.phone || "—"}</td>
                <td className="p-3">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    onClick={() => setEditStaff(s)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editStaff && (
        <Modal isOpen={!!editStaff} onClose={() => { setEditStaff(null); load() }}>
          <StaffEditForm staff={editStaff} />
        </Modal>
      )}
    </>
  )
}
