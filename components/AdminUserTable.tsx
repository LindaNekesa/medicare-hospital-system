"use client"
import { useState } from "react"
import useSWR from "swr"

type User = {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  department?: { name: string }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminUserTable() {
  const { data: users, mutate } = useSWR<User[]>("/api/admin/users", fetcher)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleDelete = async (id: number) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id })
    })
    mutate()
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department?.name || "-"}</td>
              <td className="flex gap-2 p-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="bg-yellow-500 px-2 py-1 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 px-2 py-1 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-2">Edit User</h3>
            {/* Include a form similar to PatientEditForm to update the user */}
            <button onClick={() => setEditingUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}