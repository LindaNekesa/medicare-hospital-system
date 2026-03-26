"use client"

import { useState } from "react"

export default function StaffEditForm({ staff }: { staff: any }) {
  const [formData, setFormData] = useState(staff)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/staff/${formData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    alert("Staff updated successfully")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="DOCTOR">Doctor</option>
        <option value="NURSE">Nurse</option>
        <option value="RECEPTIONIST">Receptionist</option>
        <option value="LAB_TECHNICIAN">Lab Technician</option>
        <option value="ADMIN">Admin</option>
      </select>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  )
}