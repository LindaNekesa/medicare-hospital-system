import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/patients/stats
// All queries use indexed columns — runs in parallel for speed
export async function GET() {
  try {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // All run in parallel — single round-trip to the DB
    const [
      totalPatients,
      todayAppointments,
      pendingAppointments,
      newPatientsThisWeek,
      newPatientsThisMonth,
      appointmentsByStatus,
      genderBreakdown,
    ] = await Promise.all([
      // Total patients ever registered
      prisma.patient.count(),

      // Appointments scheduled for today (uses date index)
      prisma.appointment.count({
        where: { date: { gte: today, lt: tomorrow } },
      }),

      // Pending appointments today (uses composite date+status index)
      prisma.appointment.count({
        where: {
          date:   { gte: today, lt: tomorrow },
          status: "PENDING",
        },
      }),

      // New patients in last 7 days (uses createdAt index)
      prisma.patient.count({
        where: { createdAt: { gte: weekAgo } },
      }),

      // New patients this calendar month
      prisma.patient.count({
        where: { createdAt: { gte: monthStart } },
      }),

      // Appointment status breakdown for today
      prisma.appointment.groupBy({
        by:      ["status"],
        where:   { date: { gte: today, lt: tomorrow } },
        _count:  { status: true },
      }),

      // Gender breakdown across all patients
      prisma.patient.groupBy({
        by:     ["gender"],
        _count: { gender: true },
      }),
    ]);

    return NextResponse.json({
      totalPatients,
      todayAppointments,
      pendingAppointments,
      newPatientsThisWeek,
      newPatientsThisMonth,
      appointmentsByStatus: appointmentsByStatus.map(r => ({
        status: r.status,
        count:  r._count.status,
      })),
      genderBreakdown: genderBreakdown.map(r => ({
        gender: r.gender,
        count:  r._count.gender,
      })),
    });
  } catch (error) {
    console.error("[GET /api/patients/stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
