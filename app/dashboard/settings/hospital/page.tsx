"use client"

import { useState } from "react"

export default function HospitalSettings() {

  const [logo, setLogo] = useState<File | null>(null)

  const handleUpload = async () => {

    const formData = new FormData()
    if (logo) formData.append("logo", logo)

    await fetch("/api/settings/logo", {
      method: "POST",
      body: formData
    })
  }

  return (
    <div className="space-y-4">

      <h1 className="text-xl font-bold">
        Hospital Settings
      </h1>

      <input
        type="file"
        onChange={(e) => setLogo(e.target.files?.[0] || null)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload Logo
      </button>

    </div>
  )
}