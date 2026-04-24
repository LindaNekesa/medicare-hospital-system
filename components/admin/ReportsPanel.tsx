"use client"

import { useState, useEffect } from "react"

type ReportRow = { name: string; patients: number; appointments: number }

const FALLBACK: ReportRow[] = [
  { name: "Jan", patients: 320, appointments: 410 },
  { name: "Feb", patients: 280, appointments: 360 },
  { name: "Mar", patients: 410, appointments: 520 },
  { name: "Apr", patients: 390, appointments: 480 },
  { name: "May", patients: 450, appointments: 560 },
  { name: "Jun", patients: 500, appointments: 620 },
]

export default function ReportsPanel() {
  const [data, setData] = useState<ReportRow[]>(FALLBACK)

  useEffect(() => {
    fetch("/api/admin/reports")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (Array.isArray(d) && d.length > 0) setData(d) })
      .catch(() => {/* use fallback */})
  }, [])

  const maxVal = Math.max(...data.flatMap(d => [d.patients, d.appointments]), 1)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Hospital Reports</h2>
      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-end gap-2 h-48">
          {data.map(row => (
            <div key={row.name} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "160px" }}>
                <div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(row.patients / maxVal) * 100}%` }} title={`Patients: ${row.patients}`} />
                <div className="flex-1 bg-green-400 rounded-t" style={{ height: `${(row.appointments / maxVal) * 100}%` }} title={`Appointments: ${row.appointments}`} />
              </div>
              <span className="text-xs text-gray-500">{row.name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-sm inline-block" />Patients</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-sm inline-block" />Appointments</span>
        </div>
      </div>
    </div>
  )
}
