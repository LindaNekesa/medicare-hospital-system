"use client"

import { useState, useEffect, useCallback } from "react"

type Appointment = {
  id: number
  status: string
  appointmentDate: string
  timeSlot: string
  patient: { firstName: string; lastName: string }
  doctor: { name: string }
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAppointments = useCallback(() => {
    setLoading(true)
    fetch("/api/appointments")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => {
        setAppointments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    fetchAppointments()
  }

  if (error) return <div className="text-red-600 p-4">Error loading appointments.</div>
  if (loading) return <div className="text-gray-500 p-4">Loading appointments...</div>
  if (appointments.length === 0) return <div className="text-gray-400 p-4">No appointments found.</div>

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Patient</th>
            <th className="border px-3 py-2 text-left">Doctor</th>
            <th className="border px-3 py-2 text-left">Date</th>
            <th className="border px-3 py-2 text-left">Time Slot</th>
            <th className="border px-3 py-2 text-left">Status</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{a.patient.firstName} {a.patient.lastName}</td>
              <td className="border px-3 py-2">{a.doctor.name}</td>
              <td className="border px-3 py-2">{new Date(a.appointmentDate).toLocaleDateString()}</td>
              <td className="border px-3 py-2">{a.timeSlot}</td>
              <td className="border px-3 py-2">{a.status}</td>
              <td className="border px-3 py-2 space-x-1">
                {a.status !== "CONFIRMED" && (
                  <button
                    onClick={() => updateStatus(a.id, "CONFIRMED")}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    Confirm
                  </button>
                )}
                {a.status !== "CANCELLED" && (
                  <button
                    onClick={() => updateStatus(a.id, "CANCELLED")}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
                {a.status !== "COMPLETED" && (
                  <button
                    onClick={() => updateStatus(a.id, "COMPLETED")}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
