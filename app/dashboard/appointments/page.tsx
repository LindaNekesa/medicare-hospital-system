"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import AppointmentList from "@/components/appointments/AppointmentList"

export default function AppointmentsPage() {
  const user = { name: "Dr. Linda", role: "DOCTOR" } // replace with session

  return (
    <DashboardLayout userName={user.name} role={user.role}>
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <AppointmentList />
    </DashboardLayout>
  )
}