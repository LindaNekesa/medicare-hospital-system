"use client"

import { useState, useEffect, useCallback } from "react"

type Appt = {
  id: number
  status: string
  date?: string
  appointmentDate?: string
  patient?: { firstName: string; lastName: string }
  doctor?: { name: string }
  patientName?: string
  doctorName?: string
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appt[]>([])
  const [loading, setLoading]           = useState(true)

  const load = useCallback(() => {
    fetch("/api/appointments")
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => { setAppointments(Array.isArray(d.data ?? d) ? (d.data ?? d) : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <p className="text-gray-500 py-4">Loading appointments...</p>

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Recent Appointments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {["Patient", "Doctor", "Date", "Status"].map(h => (
                <th key={h} className="p-3 border text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">No appointments found</td></tr>
            ) : appointments.map(a => {
              const patientName = a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : (a.patientName ?? "—")
              const doctorName  = a.doctor?.name ?? a.doctorName ?? "—"
              const dateStr     = a.date ?? a.appointmentDate
              return (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{patientName}</td>
                  <td className="p-3">{doctorName}</td>
                  <td className="p-3">{dateStr ? new Date(dateStr).toLocaleDateString() : "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      a.status === "PENDING"   ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{a.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
