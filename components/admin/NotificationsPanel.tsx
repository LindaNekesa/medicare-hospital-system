"use client"

import { useState } from "react"

type Notification = { id: string; message: string; type: string; createdAt: string }

export default function NotificationsPanel() {
  const [notifications] = useState<Notification[]>([
    { id: "1", message: "New patient registered: John Doe", type: "info", createdAt: new Date().toISOString() },
    { id: "2", message: "Appointment confirmed for Dr. Sarah Johnson", type: "appointment", createdAt: new Date().toISOString() },
    { id: "3", message: "Lab result ready for patient P-001", type: "lab", createdAt: new Date().toISOString() },
  ])

  const TYPE_COLORS: Record<string, string> = {
    info:        "bg-blue-50 border-blue-200 text-blue-700",
    appointment: "bg-green-50 border-green-200 text-green-700",
    lab:         "bg-purple-50 border-purple-200 text-purple-700",
    payment:     "bg-yellow-50 border-yellow-200 text-yellow-700",
    alert:       "bg-red-50 border-red-200 text-red-700",
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-gray-400 py-4">No notifications</p>
        ) : notifications.map(n => (
          <div key={n.id} className={`p-3 border rounded-lg text-sm ${TYPE_COLORS[n.type] ?? "bg-gray-50 border-gray-200 text-gray-700"}`}>
            <p>{n.message}</p>
            <p className="text-xs opacity-60 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
