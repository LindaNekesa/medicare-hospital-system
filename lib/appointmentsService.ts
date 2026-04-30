import { prisma } from "@/lib/prisma"

export type CreateAppointmentInput = {
  patientId: string
  doctorId: string
  date: Dateco
  reason?: string
}

export type UpdateAppointmentInput = {
  appointmentId: string
  date?: Date
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  reason?: string
}

// 📌 Create appointment
export async function createAppointment(data: CreateAppointmentInput) {
  return await prisma.appointment.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      date: data.date,
      reason: data.reason,
      status: "PENDING",
    },
  })
}

// 📌 Get all appointments (admin/staff)
export async function getAllAppointments() {
  return await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}

// 📌 Get appointments for a specific doctor
export async function getDoctorAppointments(doctorId: string) {
  return await prisma.appointment.findMany({
    where: { doctorId },
    include: {
      patient: true,
    },
    orderBy: {
      date: "asc",
    },
  })
}

// 📌 Get appointments for a specific patient
export async function getPatientAppointments(patientId: string) {
  return await prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}

// 📌 Update appointment
export async function updateAppointment(data: UpdateAppointmentInput) {
  return await prisma.appointment.update({
    where: { id: data.appointmentId },
    data: {
      ...(data.date && { date: data.date }),
      ...(data.status && { status: data.status }),
      ...(data.reason && { reason: data.reason }),
    },
  })
}

// 📌 Delete appointment
export async function deleteAppointment(appointmentId: string) {
  return await prisma.appointment.delete({
    where: { id: appointmentId },
  })
}

// 📌 Check doctor availability (basic version)
export async function isDoctorAvailable(doctorId: string, date: Date) {
  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
  })

  return !existing
}