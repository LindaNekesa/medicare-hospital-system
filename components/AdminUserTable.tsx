"use client"
import { useState, useEffect, useCallback } from "react"

type User = {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  department?: { name: string }
}

export default function AdminUserTable() {
  const [users, setUsers]       = useState<User[]>([])
  const [loading, setLoading]   = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [toast, setToast]       = useState("")

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/users")
      .then(r => r.ok ? r.json() : [])
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: number) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    })
    load()
    setToast("User removed")
    setTimeout(() => setToast(""), 2500)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">{toast}</div>}
      <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
      {loading ? (
        <p className="text-gray-500 py-4">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Role", "Department", "Actions"].map(h => (
                  <th key={h} className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No users found</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{user.role}</span>
                  </td>
                  <td className="p-3 text-gray-500">{user.department?.name || "—"}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => setEditingUser(user)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Edit User — {editingUser.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Role: {editingUser.role} · {editingUser.email}</p>
            <button onClick={() => setEditingUser(null)} className="w-full border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
