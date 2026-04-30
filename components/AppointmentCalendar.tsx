"use client"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = { "en-US": require("date-fns/locale/en-US") }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function AppointmentCalendar({ appointments }: any) {
  const events = appointments.map((a: any) => ({
    title: a.patient?.name || "Appointment",
    start: new Date(a.date),
    end: new Date(new Date(a.date).getTime() + 30 * 60 * 1000),
  }))

  return (
    <div className="h-[600px]">
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" />
    </div>
  )
}