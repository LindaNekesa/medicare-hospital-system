import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/appointments
// Supports: ?patientId=1&staffId=2&date=2026-04-22&status=PENDING&page=1&limit=50
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const patientId = searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!, 10) : undefined;
    const staffId   = searchParams.get("staffId")   ? parseInt(searchParams.get("staffId")!,   10) : undefined;
    const status    = searchParams.get("status")    ?? undefined;
    const dateStr   = searchParams.get("date");
    const page      = Math.max(1, parseInt(searchParams.get("page")  ?? "1",  10));
    const limit     = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));

    // Date filter — uses the date index
    let dateFilter: { gte: Date; lt: Date } | undefined;
    if (dateStr) {
      const d = new Date(dateStr);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      dateFilter = { gte: d, lt: next };
    }

    const where = {
      ...(patientId !== undefined && { patientId }),
      ...(staffId   !== undefined && { staffId }),
      ...(status    !== undefined && { status }),
      ...(dateFilter              && { date: dateFilter }),
    };

    const [total, appointments] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.findMany({
        where,
        skip:    (page - 1) * limit,
        take:    limit,
        orderBy: { date: "asc" },
        select: {
          id:        true,
          date:      true,
          time:      true,
          reason:    true,
          status:    true,
          notes:     true,
          createdAt: true,
          patient: {
            select: {
              id: true, firstName: true, lastName: true, phone: true,
            },
          },
          staff: {
            select: {
              id: true,
              user: { select: { name: true } },
              staffType: true,
              department: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data:       appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore:    appointments.length === limit,
    });
  } catch (error) {
    console.error("[GET /api/appointments]", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// POST /api/appointments — book a new appointment
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.patientId || !data.date || !data.time) {
      return NextResponse.json(
        { error: "Missing required fields: patientId, date, time" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(data.patientId, 10),
        staffId:   data.staffId ? parseInt(data.staffId, 10) : null,
        date:      new Date(data.date),
        time:      data.time,
        reason:    data.reason   || null,
        status:    data.status   || "PENDING",
        notes:     data.notes    || null,
      },
      select: {
        id: true, date: true, time: true, status: true, reason: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/appointments]", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

// PATCH /api/appointments — update status or notes
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Appointment id is required" }, { status: 400 });
    }

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(data.id, 10) },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.notes  !== undefined && { notes:  data.notes }),
        ...(data.time   !== undefined && { time:   data.time }),
        ...(data.date   !== undefined && { date:   new Date(data.date) }),
      },
      select: { id: true, status: true, updatedAt: true },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("[PATCH /api/appointments]", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
