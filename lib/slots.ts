import { prisma } from "@/lib/prisma"

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function minutesToDate(base: Date, minutes: number) {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  d.setMinutes(minutes)
  return d
}

export async function getAvailableSlotsWithMeta(
  doctorId: string,
  date: Date,
  slotDuration = 30
) {
  const day = date.getDay()

  const availability = await prisma.doctorAvailability.findFirst({
    where: { doctorId, dayOfWeek: day },
  })

  if (!availability) {
    return { slots: [], total: 0, available: 0, isAlmostFull: false }
  }

  const start = toMinutes(availability.startTime)
  const end = toMinutes(availability.endTime)

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  })

  const booked = new Set(
    appointments.map(a => new Date(a.date).getTime())
  )

  const slots: Date[] = []
  let total = 0

  const now = new Date()

  for (let m = start; m < end; m += slotDuration) {
    total++
    const slot = minutesToDate(date, m)

    if (slot <= now) continue
    if (!booked.has(slot.getTime())) {
      slots.push(slot)
    }
  }

  return {
    slots,
    total,
    available: slots.length,
    isAlmostFull: slots.length / total <= 0.2,
  }
}