"use client"

import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AppointmentList() {
  const { data: appointments, error } = useSWR("/api/appointments", fetcher)

  if (error) return <div>Error loading appointments</div>
  if (!appointments) return <div>Loading appointments...</div>

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    // Re-fetch appointments
    mutate("/api/appointments")
  }

  return (
    <table className="table-auto w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Patient</th>
          <th className="border px-2 py-1">Doctor</th>
          <th className="border px-2 py-1">Date</th>
          <th className="border px-2 py-1">Time Slot</th>
          <th className="border px-2 py-1">Status</th>
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a: any) => (
          <tr key={a.id} className="hover:bg-gray-50">
            <td className="border px-2 py-1">{a.patient.firstName} {a.patient.lastName}</td>
            <td className="border px-2 py-1">{a.doctor.name}</td>
            <td className="border px-2 py-1">{new Date(a.appointmentDate).toLocaleDateString()}</td>
            <td className="border px-2 py-1">{a.timeSlot}</td>
            <td className="border px-2 py-1">{a.status}</td>
            <td className="border px-2 py-1 space-x-2">
              {a.status !== "CONFIRMED" && (
                <button
                  onClick={() => updateStatus(a.id, "CONFIRMED")}
                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              )}
              {a.status !== "CANCELLED" && (
                <button
                  onClick={() => updateStatus(a.id, "CANCELLED")}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
              {a.status !== "COMPLETED" && (
                <button
                  onClick={() => updateStatus(a.id, "COMPLETED")}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Complete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}