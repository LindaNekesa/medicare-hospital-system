"use client"

import { useEffect, useState } from "react"

export default function TimeSlotPicker({
  doctorId,
  selectedDate,
  onSelect,
}: any) {
  const [slots, setSlots] = useState<Date[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!doctorId || !selectedDate) return

    const fetchSlots = async () => {
      setLoading(true)

      const res = await fetch(
        `/api/appointments/slots?doctorId=${doctorId}&date=${selectedDate}`
      )

      const data = await res.json()
      setSlots(data)
      setLoading(false)
    }

    fetchSlots()
  }, [doctorId, selectedDate])

  if (loading) return <p>Loading slots...</p>

  if (!slots.length) {
    return <p>No available slots</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot, i) => {
        const date = new Date(slot)

        return (
          <button
            key={i}
            onClick={() => onSelect(date)}
            className="border p-2 rounded hover:bg-blue-500 hover:text-white"
          >
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </button>
        )
      })}
    </div>
  )
}