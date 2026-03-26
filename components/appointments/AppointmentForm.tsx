"use client"

import { useState } from "react"

type Doctor = { id: number; name: string }
type Patient = { id: number; firstName: string; lastName: string }

type Props = {
  doctors: Doctor[]
  patients: Patient[]
}

export default function AppointmentForm({ doctors, patients }: Props) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    timeSlot: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await res.json()
    console.log("Appointment created:", data)
    alert("Appointment booked successfully!")
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      timeSlot: "",
      notes: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Book New Appointment</h2>

      <select
        name="patientId"
        value={formData.patientId}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName} {p.lastName}
          </option>
        ))}
      </select>

      <select
        name="doctorId"
        value={formData.doctorId}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      >
        <option value="">Select Doctor</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="appointmentDate"
        value={formData.appointmentDate}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="text"
        name="timeSlot"
        value={formData.timeSlot}
        placeholder="Time Slot (e.g., 09:00 - 10:00)"
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="text"
        name="notes"
        value={formData.notes}
        placeholder="Notes (optional)"
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book Appointment
      </button>
    </form>
  )
}