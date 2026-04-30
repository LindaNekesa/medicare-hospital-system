"use client"

import { useState, useEffect, useCallback } from "react"

type Appointment = {
  id: number
  patientName: string
  doctorName: string
  appointmentDate: string
  status: string
}

export default function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading]           = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/appointments")
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => { setAppointments(Array.isArray(d.data ?? d) ? (d.data ?? d) : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/appointments`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  if (loading) return <p className="text-gray-500 py-4">Loading appointments...</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {["Patient", "Doctor", "Date", "Status", "Actions"].map(h => (
              <th key={h} className="p-3 border text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr><td colSpan={5} className="p-6 text-center text-gray-400">No appointments found</td></tr>
          ) : appointments.map(app => (
            <tr key={app.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{app.patientName}</td>
              <td className="p-3">{app.doctorName}</td>
              <td className="p-3">{new Date(app.appointmentDate).toLocaleString()}</td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  app.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                  app.status === "PENDING"   ? "bg-yellow-100 text-yellow-700" :
                  app.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                  "bg-red-100 text-red-700"
                }`}>{app.status}</span>
              </td>
              <td className="p-3 space-x-1">
                <button onClick={() => updateStatus(app.id, "CONFIRMED")} className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Confirm</button>
                <button onClick={() => updateStatus(app.id, "CANCELLED")} className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Cancel</button>
                <button onClick={() => updateStatus(app.id, "COMPLETED")} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
