"use client"

import { useState, useEffect, useCallback } from "react"

type Doctor = {
  id: number
  name: string
  email: string
  doctorAppointments?: { id: number; appointmentDate: string; patient: { firstName: string; lastName: string } }[]
  tasks?: { id: number; title: string; dueDate: string }[]
}

export default function DoctorStatusTable() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    fetch("/api/staff")
      .then(r => r.ok ? r.json() : [])
      .then(d => { setDoctors(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    // Refresh every 5 seconds
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [load])

  if (loading) return <p className="text-gray-500 py-4">Loading doctors...</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {["Doctor", "Pending Appointments", "Pending Tasks", "Availability"].map(h => (
              <th key={h} className="p-3 border text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr><td colSpan={4} className="p-6 text-center text-gray-400">No doctors found</td></tr>
          ) : doctors.map(doc => {
            const appts = doc.doctorAppointments ?? []
            const tasks = doc.tasks ?? []
            return (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900">{doc.name}</td>
                <td className="p-3">
                  {appts.length === 0 ? (
                    <span className="text-green-600 font-semibold">None</span>
                  ) : appts.map(a => (
                    <div key={a.id} className="text-xs text-gray-600">
                      {a.patient.firstName} {a.patient.lastName} — {new Date(a.appointmentDate).toLocaleString()}
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  {tasks.length === 0 ? (
                    <span className="text-green-600 font-semibold">None</span>
                  ) : tasks.map(t => (
                    <div key={t.id} className="text-xs text-gray-600">
                      {t.title} — due {new Date(t.dueDate).toLocaleDateString()}
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  {appts.length === 0 ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Available</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Busy</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
