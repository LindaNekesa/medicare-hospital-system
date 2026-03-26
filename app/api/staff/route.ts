// /app/api/staff/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    include: {
      doctorAppointments: {
        where: { status: "PENDING" },
        select: { id: true, appointmentDate: true, patient: { select: { firstName: true, lastName: true } } },
      },
      tasks: {
        where: { status: "PENDING" },
        select: { id: true, title: true, dueDate: true },
      },
    },
  });
  return NextResponse.json(doctors);
}