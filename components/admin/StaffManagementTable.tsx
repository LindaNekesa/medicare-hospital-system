"use client"

import { useState, useEffect, useCallback } from "react"

type StaffUser = { id: number; name: string; email: string; role: string }

export default function StaffManagementTable() {
  const [staff, setStaff]   = useState<StaffUser[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]     = useState({ name: "", email: "", role: "DOCTOR" })
  const [toast, setToast]   = useState("")

  const load = useCallback(() => {
    fetch("/api/admin/users")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setStaff(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000) }

  const createUser = async () => {
    if (!form.name || !form.email) return showToast("Name and email are required")
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) { load(); setForm({ name: "", email: "", role: "DOCTOR" }); showToast("Staff member added") }
    else showToast("Failed to add staff member")
  }

  const deleteUser = async (id: number) => {
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    if (res.ok) { load(); showToast("Staff member removed") }
    else showToast("Failed to remove staff member")
  }

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">{toast}</div>}
      <h2 className="text-xl font-bold">Staff Management</h2>

      <div className="flex flex-wrap gap-2">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
          {["DOCTOR", "NURSE", "ADMIN", "RECEPTIONIST", "LAB_TECH", "PHARMACIST"].map(r => <option key={r}>{r}</option>)}
        </select>
        <button onClick={createUser} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Staff</button>
      </div>

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>{["Name", "Email", "Role", "Action"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {staff.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2 text-gray-600">{u.email}</td>
                  <td className="px-4 py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{u.role}</span></td>
                  <td className="px-4 py-2">
                    <button onClick={() => deleteUser(u.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
