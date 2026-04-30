"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function AppointmentsTable() {
  const queryClient = useQueryClient()

  // ✅ FIXED useQuery (v5 syntax)
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments")
      if (!res.ok) throw new Error("Failed to fetch appointments")
      return res.json()
    }
  })

  // ✅ FIXED useMutation (v5 syntax)
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    }
  })

  if (isLoading) return <p>Loading appointments...</p>

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Patient</th>
          <th className="p-2 border">Doctor</th>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((app: any) => (
          <tr key={app.id} className="border-b">
            <td className="p-2">{app.patientName}</td>
            <td className="p-2">{app.doctorName}</td>
            <td className="p-2">
              {new Date(app.appointmentDate).toLocaleString()}
            </td>
            <td className="p-2">{app.status}</td>
            <td className="p-2 space-x-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded"
                onClick={() =>
                  updateStatus.mutate({ id: app.id, status: "CONFIRMED" })
                }
              >
                Confirm
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() =>
                  updateStatus.mutate({ id: app.id, status: "CANCELLED" })
                }
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-2 py-1 rounded"
                onClick={() =>
                  updateStatus.mutate({ id: app.id, status: "COMPLETED" })
                }
              >
                Complete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}