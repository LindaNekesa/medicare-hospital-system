"use client"

import { useState } from "react"
import StaffManagementTable from "./StaffManagementTable"
import AuditLogsTable from "./AuditLogsTable"
import SystemSettingsPanel from "./SystemsSettingsPanel"
import ReportsPanel from "./ReportsPanel"
import NotificationsPanel from "./NotificationsPanel"

export default function AdminDashboard() {
  const [tab, setTab] = useState("staff")

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="flex gap-4">
        <button onClick={() => setTab("staff")} className="btn">Staff</button>
        <button onClick={() => setTab("logs")} className="btn">Audit Logs</button>
        <button onClick={() => setTab("settings")} className="btn">Settings</button>
        <button onClick={() => setTab("reports")} className="btn">Reports</button>
        <button onClick={() => setTab("notifications")} className="btn">Notifications</button>
      </div>

      {tab === "staff" && <StaffManagementTable />}
      {tab === "logs" && <AuditLogsTable />}
      {tab === "settings" && <SystemSettingsPanel />}
      {tab === "reports" && <ReportsPanel />}
      {tab === "notifications" && <NotificationsPanel />}
    </div>
  )
}