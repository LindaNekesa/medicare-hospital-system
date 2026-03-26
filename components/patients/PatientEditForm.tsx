"use client"

import { useState } from "react"

// Define Patient type with optional fields and gender enum
type Gender = "MALE" | "FEMALE" | "OTHER"

type Patient = {
  id: number
  firstName: string
  lastName: string
  gender: Gender
  phone?: string
  email?: string
  address?: string
}

type Props = {
  patient: Patient
}

export default function PatientEditForm({ patient }: Props) {
  // Initialize form data from props
  const [formData, setFormData] = useState<Patient>(patient)

  // Handle changes for inputs and select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as keyof Patient
    setFormData({
      ...formData,
      [name]: e.target.value
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Replace this with your API call to save data
    console.log("Updated patient:", formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold">Edit Patient</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      >
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>

      <input
        type="tel"
        name="phone"
        value={formData.phone || ""}
        onChange={handleChange}
        placeholder="Phone Number"
        className="border p-2 rounded w-full"
      />

      <input
        type="email"
        name="email"
        value={formData.email || ""}
        onChange={handleChange}
        placeholder="Email Address"
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        name="address"
        value={formData.address || ""}
        onChange={handleChange}
        placeholder="Address"
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Save Changes
      </button>
    </form>
  )
}