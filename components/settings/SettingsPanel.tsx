"use client"

import { useEffect, useState } from "react"

type Setting = {
  id: number
  key: string
  value: string
  description?: string
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "" })

  // Fetch settings
  const fetchSettings = async () => {
    const res = await fetch("/api/settings")
    const data = await res.json()
    setSettings(data)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Create new setting
  const handleCreate = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify(newSetting),
      headers: { "Content-Type": "application/json" },
    })
    const created = await res.json()
    setSettings([...settings, created])
    setNewSetting({ key: "", value: "", description: "" })
  }

  // Update setting
  const handleUpdate = async (setting: Setting) => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(setting),
      headers: { "Content-Type": "application/json" },
    })
    const updated = await res.json()
    setSettings(settings.map(s => (s.id === updated.id ? updated : s)))
  }

  // Delete setting
  const handleDelete = async (id: number) => {
    await fetch("/api/settings", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    })
    setSettings(settings.filter(s => s.id !== id))
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>

      <div className="grid grid-cols-3 gap-2">
        <input
          placeholder="Key"
          className="border p-2 rounded"
          value={newSetting.key}
          onChange={e => setNewSetting({ ...newSetting, key: e.target.value })}
        />
        <input
          placeholder="Value"
          className="border p-2 rounded"
          value={newSetting.value}
          onChange={e => setNewSetting({ ...newSetting, value: e.target.value })}
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {settings.map(setting => (
          <div key={setting.id} className="flex items-center gap-2">
            <input
              className="border p-2 rounded w-1/3"
              value={setting.key}
              onChange={e => handleUpdate({ ...setting, key: e.target.value })}
            />
            <input
              className="border p-2 rounded w-1/3"
              value={setting.value}
              onChange={e => handleUpdate({ ...setting, value: e.target.value })}
            />
            <button
              onClick={() => handleDelete(setting.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}