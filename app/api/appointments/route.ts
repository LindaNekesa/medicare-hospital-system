// app/api/appointments/route.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const appointment = await prisma.appointment.create({
    data: {
      patientId: data.patientId as string, // ensure string
      doctorId: data.doctorId as string,   // ensure string
      appointmentDate: new Date(data.appointmentDate),
      timeSlot: data.timeSlot,
      notes: data.notes || "",
      status: "PENDING",
    } as Prisma.AppointmentUncheckedCreateInput,
  });

  return new Response(JSON.stringify(appointment));
}