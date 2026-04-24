"use client"

import { useState, useEffect } from "react"

type Settings = {
  hospitalName: string
  hospitalEmail: string
  hospitalPhone: string
  hospitalAddress: string
  workingHoursStart: string
  workingHoursEnd: string
  appointmentLength: number
  enableNotifications: boolean
}

const DEFAULTS: Settings = {
  hospitalName: "Medicare Hospital",
  hospitalEmail: "info@medicare.com",
  hospitalPhone: "+254 700 000 000",
  hospitalAddress: "Nairobi, Kenya",
  workingHoursStart: "08:00",
  workingHoursEnd: "17:00",
  appointmentLength: 30,
  enableNotifications: true,
}

export default function SystemSettingsPanel() {
  const [form, setForm]     = useState<Settings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [toast, setToast]   = useState("")

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setForm({ ...DEFAULTS, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const save = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setToast(res.ok ? "Settings saved successfully" : "Failed to save settings")
    setTimeout(() => setToast(""), 3000)
  }

  if (loading) return <p className="text-gray-500 py-4">Loading settings...</p>

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4 max-w-2xl">
      {toast && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{toast}</div>}
      <h2 className="text-xl font-bold">Hospital System Settings</h2>

      {[
        ["Hospital Name",    "hospitalName",    "text",  "Medicare Hospital"],
        ["Hospital Email",   "hospitalEmail",   "email", "info@medicare.com"],
        ["Hospital Phone",   "hospitalPhone",   "text",  "+254 700 000 000"],
        ["Hospital Address", "hospitalAddress", "text",  "Nairobi, Kenya"],
      ].map(([label, key, type, placeholder]) => (
        <div key={key as string}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label as string}</label>
          <input type={type as string} className="border rounded-lg px-3 py-2 w-full text-sm" placeholder={placeholder as string}
            value={(form as Record<string, unknown>)[key as string] as string}
            onChange={e => setForm({ ...form, [key as string]: e.target.value })} />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours Start</label>
          <input type="time" className="border rounded-lg px-3 py-2 w-full text-sm" value={form.workingHoursStart} onChange={e => setForm({ ...form, workingHoursStart: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours End</label>
          <input type="time" className="border rounded-lg px-3 py-2 w-full text-sm" value={form.workingHoursEnd} onChange={e => setForm({ ...form, workingHoursEnd: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Length (minutes)</label>
        <input type="number" min={5} max={120} className="border rounded-lg px-3 py-2 w-full text-sm" value={form.appointmentLength}
          onChange={e => setForm({ ...form, appointmentLength: Number(e.target.value) })} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" checked={form.enableNotifications} onChange={e => setForm({ ...form, enableNotifications: e.target.checked })} className="rounded" />
        Enable email notifications
      </label>

      <button onClick={save} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
        Save Settings
      </button>
    </div>
  )
}