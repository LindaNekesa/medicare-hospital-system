"use client"

import { useState } from "react"

// Define a type for patient form data
type Gender = "MALE" | "FEMALE" | "OTHER"

type PatientFormData = {
  firstName: string
  lastName: string
  gender: Gender | ""
  phone?: string
  email?: string
  dateOfBirth: string
  address?: string
  emergencyContact?: string
}

export default function PatientRegistrationForm() {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof PatientFormData
    setFormData({
      ...formData,
      [name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Patient Data:", formData)
    // TODO: Call your API route here to save patient data to Prisma/PostgreSQL
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border p-2 rounded w-full"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border p-2 rounded w-full"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="dateOfBirth"
          className="border p-2 rounded w-full"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          className="border p-2 rounded w-full"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        className="border p-2 rounded w-full"
        value={formData.phone || ""}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="border p-2 rounded w-full"
        value={formData.email || ""}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Home Address"
        className="border p-2 rounded w-full"
        value={formData.address || ""}
        onChange={handleChange}
      />

      <input
        type="text"
        name="emergencyContact"
        placeholder="Emergency Contact"
        className="border p-2 rounded w-full"
        value={formData.emergencyContact || ""}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Register Patient
      </button>
    </form>
  )
}