"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import useSWR from "swr"
import PatientTable from "@/components/patients/PatientsTable"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PatientsPage() {
  const { data: patients, error } = useSWR("/api/patients", fetcher)

  const user = { name: "Admin User", role: "ADMIN" }

  if (error) return <div>Error loading patients</div>
  if (!patients) return <div>Loading...</div>

  return (
    <DashboardLayout userName={user.name} role={user.role}>
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      <PatientTable patients={patients} />
    </DashboardLayout>
  )
}