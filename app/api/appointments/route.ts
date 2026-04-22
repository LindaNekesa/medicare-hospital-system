import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { firstName: true, lastName: true } },
        staff: { select: { staffType: true, user: { select: { name: true } } } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const appointment = await prisma.appointment.create({
      data: {
        patientId: Number(data.patientId),
        staffId: data.staffId ? Number(data.staffId) : null,
        date: new Date(data.date || data.appointmentDate),
        time: data.time || data.timeSlot || "",
        reason: data.reason || null,
        notes: data.notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
