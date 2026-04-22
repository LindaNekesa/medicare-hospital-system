"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import PatientsTable from "@/components/patients/PatientsTable"

type Patient = {
  id: number
  firstName: string
  lastName: string
  gender: "MALE" | "FEMALE" | "OTHER"
  phone?: string
  email?: string
  address?: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/patients")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => {
        setPatients(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const user = { name: "Admin User", role: "ADMIN" }

  if (error) return (
    <DashboardLayout userName={user.name} role={user.role}>
      <div className="text-red-600 p-4">Error loading patients. Please try again.</div>
    </DashboardLayout>
  )

  if (loading) return (
    <DashboardLayout userName={user.name} role={user.role}>
      <div className="text-gray-500 p-4">Loading patients...</div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout userName={user.name} role={user.role}>
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      <PatientsTable patients={patients} />
    </DashboardLayout>
  )
}
