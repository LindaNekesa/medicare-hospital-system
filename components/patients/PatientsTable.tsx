// components/patients/PatientTable.tsx
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Modal from "@/components/ui/Modal"
import PatientEditForm from "@/components/patients/PatientEditForm"

export default function PatientsTable() {
  const [editPatient, setEditPatient] = useState<any | null>(null)

  const { data: patients = [], isLoading } = useQuery(["patients"], async () => {
    const res = await fetch("/api/patients")
    return res.json()
  })

  if (isLoading) return <p>Loading patients...</p>

  return (
    <>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">First Name</th>
            <th className="p-2 border">Last Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p: any) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.firstName}</td>
              <td className="p-2">{p.lastName}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">{p.phone}</td>
              <td className="p-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => setEditPatient(p)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editPatient && (
        <Modal isOpen={!!editPatient} onClose={() => setEditPatient(null)}>
          <PatientEditForm patient={editPatient} />
        </Modal>
      )}
    </>
  )
}