"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import TimeSlotPicker from "./TimeSlotPicker"

const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)

export default function AppointmentForm({ doctors }: any) {
  const [doctorId, setDoctorId] = useState("")
  const [date, setDate] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify({ doctorId, date, reason }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error)
    } else {
      toast.success("Appointment booked!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select onChange={(e) => setDoctorId(e.target.value)} required>
        <option value="">Select Doctor</option>
        {doctors.map((d: any) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <input
        placeholder="Reason"
        onChange={(e) => setReason(e.target.value)}
      />

      <button type="submit">Book</button>
    </form>
  )
}