// DashboardTabs.tsx
"use client"

import { useState } from "react"
import PatientsTable from "@/components/patients/PatientsTable"
import AppointmentsTable from "@/components/appointments/AppointmentsTable"
import TasksTable from "@/components/tasks/TasksTable"
import SettingsPanel from "@/components/settings/SettingsPanel"

type Props = {
  userRole: string
}

export default function DashboardTabs({ userRole }: Props) {
  const [activeTab, setActiveTab] = useState("patients")

  const tabs = [
    { key: "patients", label: "Patients" },
    { key: "appointments", label: "Appointments" },
    { key: "tasks", label: "Tasks" },
  ]

  // Only add Settings if ADMIN
  if (userRole === "ADMIN") {
    tabs.push({ key: "settings", label: "Settings" })
  }

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.key ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "patients" && <PatientsTable />}
        {activeTab === "appointments" && <AppointmentsTable />}
        {activeTab === "tasks" && <TasksTable />}
        {activeTab === "settings" && userRole === "ADMIN" && <SettingsPanel />}
      </div>
    </div>
  )
}