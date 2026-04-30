"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RoleManager({ users, roles }: any) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateRole = async (userId: string, roleId: string) => {
    setLoading(true)

    await fetch("/api/admin/users/update-role", {
      method: "POST",
      body: JSON.stringify({ userId, roleId }),
    })

    setLoading(false)
    router.refresh() // 🔥 reload server data
  }

  return (
    <div>
      <h2>User Roles</h2>

      {users.map((user: any) => (
        <div key={user.id}>
          <span>{user.email}</span>

          <select
            value={user.roleId}
            onChange={(e) => updateRole(user.id, e.target.value)}
          >
            {roles.map((role: any) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      ))}

      {loading && <p>Updating...</p>}
    </div>
  )
}