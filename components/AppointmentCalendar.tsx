"use client"

import { useState } from "react"

type CalendarAppointment = {
  id?: number | string
  date: string
  patient?: { name?: string; firstName?: string; lastName?: string }
  reason?: string
  status?: string
  time?: string
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
}

export default function AppointmentCalendar({ appointments = [] }: { appointments?: CalendarAppointment[] }) {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year  = current.getFullYear()
  const month = current.getMonth()

  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => setCurrent(new Date(year, month - 1, 1))
  const next = () => setCurrent(new Date(year, month + 1, 1))

  const getAppts = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter(a => a.date?.startsWith(dateStr))
  }

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <button onClick={prev} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-bold text-gray-900 text-lg">{MONTHS[month]} {year}</h2>
        <button onClick={next} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-100 bg-gray-50/50" />
          const appts   = getAppts(day)
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          return (
            <div key={day} className={`min-h-[80px] border-b border-r border-gray-100 p-1.5 ${isToday ? "bg-blue-50" : "hover:bg-gray-50"}`}>
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-1 ${isToday ? "bg-blue-600 text-white" : "text-gray-700"}`}>
                {day}
              </div>
              <div className="space-y-0.5">
                {appts.slice(0, 2).map((a, j) => {
                  const name = a.patient?.name || (a.patient?.firstName ? `${a.patient.firstName} ${a.patient.lastName ?? ""}`.trim() : "Appointment")
                  return (
                    <div key={j} className={`text-xs px-1 py-0.5 rounded border truncate ${STATUS_COLORS[a.status ?? "PENDING"]}`} title={`${name}${a.time ? ` · ${a.time}` : ""}`}>
                      {name}
                    </div>
                  )
                })}
                {appts.length > 2 && (
                  <div className="text-xs text-gray-400 px-1">+{appts.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-6 py-3 border-t bg-gray-50 text-xs text-gray-500">
        {Object.entries(STATUS_COLORS).map(([status, cls]) => (
          <span key={status} className={`px-2 py-0.5 rounded border font-medium ${cls}`}>{status}</span>
        ))}
      </div>
    </div>
  )
}
