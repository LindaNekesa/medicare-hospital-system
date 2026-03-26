"use client"

import { useState } from "react"

type Props = {
  onSearch: (value: string) => void
}

export default function PatientSearch({ onSearch }: Props) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        placeholder="Search patient by name..."
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
    </div>
  )
}