import { prisma } from "@/lib/prisma"

// Convert "HH:MM" → minutes
function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export async function isWithinWorkingHours(
  doctorId: string,
  date: Date
) {
  const day = date.getDay()

  const availability = await prisma.doctorAvailability.findFirst({
    where: {
      doctorId,
      dayOfWeek: day,
    },
  })

  if (!availability) return false

  const appointmentMinutes =
    date.getHours() * 60 + date.getMinutes()

  const start = timeToMinutes(availability.startTime)
  const end = timeToMinutes(availability.endTime)

  return appointmentMinutes >= start && appointmentMinutes < end
}