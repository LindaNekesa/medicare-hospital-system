// components/patients/PatientsTable.tsx
"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/ui/Modal"
import PatientEditForm from "@/components/patients/PatientEditForm"

type Patient = {
  id: number
  firstName: string
  lastName: string
  gender: "MALE" | "FEMALE" | "OTHER"
  phone?: string
  email?: string
  address?: string
}

type Props = {
  patients?: Patient[]
}

export default function PatientsTable({ patients: propPatients }: Props) {
  const [patients, setPatients] = useState<Patient[]>(propPatients ?? [])
  const [loading, setLoading] = useState(!propPatients)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)

  useEffect(() => {
    // Only fetch if no patients were passed as props
    if (propPatients) {
      setPatients(propPatients)
      return
    }
    setLoading(true)
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [propPatients])

  if (loading) return <p className="text-gray-500 py-4">Loading patients...</p>

  if (patients.length === 0) {
    return <p className="text-gray-400 py-4">No patients found.</p>
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left font-semibold text-gray-600">First Name</th>
              <th className="p-3 border text-left font-semibold text-gray-600">Last Name</th>
              <th className="p-3 border text-left font-semibold text-gray-600">Gender</th>
              <th className="p-3 border text-left font-semibold text-gray-600">Phone</th>
              <th className="p-3 border text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.firstName}</td>
                <td className="p-3">{p.lastName}</td>
                <td className="p-3 capitalize">{p.gender?.toLowerCase()}</td>
                <td className="p-3">{p.phone ?? "—"}</td>
                <td className="p-3">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    onClick={() => setEditPatient(p)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editPatient && (
        <Modal isOpen={!!editPatient} onClose={() => setEditPatient(null)}>
          <PatientEditForm patient={editPatient} />
        </Modal>
      )}
    </>
  )
}
