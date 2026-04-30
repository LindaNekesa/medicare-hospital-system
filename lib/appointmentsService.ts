import { prisma } from "@/lib/prisma"

export type CreateAppointmentInput = {
  patientId: number
  staffId?: number
  date: Date
  time: string
  reason?: string
}

export type UpdateAppointmentInput = {
  appointmentId: number
  date?: Date
  time?: string
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  reason?: string
  notes?: string
}

// Create appointment
export async function createAppointment(data: CreateAppointmentInput) {
  return await prisma.appointment.create({
    data: {
      patientId: data.patientId,
      staffId:   data.staffId ?? null,
      date:      data.date,
      time:      data.time,
      reason:    data.reason ?? null,
      status:    "PENDING",
    },
  })
}

// Get all appointments (admin/staff)
export async function getAllAppointments() {
  return await prisma.appointment.findMany({
    include: {
      patient: { select: { firstName: true, lastName: true, phone: true } },
      staff:   { select: { staffType: true, user: { select: { name: true } } } },
    },
    orderBy: { date: "desc" },
  })
}

// Get appointments for a specific staff member
export async function getStaffAppointments(staffId: number) {
  return await prisma.appointment.findMany({
    where: { staffId },
    include: {
      patient: { select: { firstName: true, lastName: true } },
    },
    orderBy: { date: "asc" },
  })
}

// Get appointments for a specific patient
export async function getPatientAppointments(patientId: number) {
  return await prisma.appointment.findMany({
    where: { patientId },
    include: {
      staff: { select: { staffType: true, user: { select: { name: true } } } },
    },
    orderBy: { date: "desc" },
  })
}

// Update appointment
export async function updateAppointment(data: UpdateAppointmentInput) {
  return await prisma.appointment.update({
    where: { id: data.appointmentId },
    data: {
      ...(data.date   !== undefined && { date:   data.date }),
      ...(data.time   !== undefined && { time:   data.time }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.reason !== undefined && { reason: data.reason }),
      ...(data.notes  !== undefined && { notes:  data.notes }),
    },
  })
}

// Delete appointment
export async function deleteAppointment(appointmentId: number) {
  return await prisma.appointment.delete({
    where: { id: appointmentId },
  })
}

// Check if a staff member is available at a given date/time
export async function isStaffAvailable(staffId: number, date: Date, time: string) {
  const existing = await prisma.appointment.findFirst({
    where: {
      staffId,
      date,
      time,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  })
  return !existing
}
