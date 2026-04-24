import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/availability — set or update a doctor's availability slot
export async function POST(req: NextRequest) {
  const session = await auth(req);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "HOSPITAL_MANAGEMENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { doctorId, dayOfWeek, startTime, endTime } = body;

  if (doctorId === undefined || dayOfWeek === undefined || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required fields: doctorId, dayOfWeek, startTime, endTime" },
      { status: 400 }
    );
  }

  const data = await prisma.doctorAvailability.upsert({
    where: {
      doctorId_dayOfWeek: {
        doctorId:  parseInt(doctorId,  10),
        dayOfWeek: parseInt(dayOfWeek, 10),
      },
    },
    update: { startTime, endTime },
    create: {
      doctorId:  parseInt(doctorId,  10),
      dayOfWeek: parseInt(dayOfWeek, 10),
      startTime,
      endTime,
    },
  });

  return NextResponse.json(data);
}

// GET /api/availability?doctorId=1
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const doctorId = searchParams.get("doctorId");

  if (!doctorId) {
    return NextResponse.json({ error: "doctorId is required" }, { status: 400 });
  }

  const slots = await prisma.doctorAvailability.findMany({
    where:   { doctorId: parseInt(doctorId, 10) },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json(slots);
}
