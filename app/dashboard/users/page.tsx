"use client"

import { useEffect, useState } from "react"

export default function UsersPage() {

  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        User Management
      </h1>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">

              <td className="p-3">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.active ? "Active" : "Disabled"}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}