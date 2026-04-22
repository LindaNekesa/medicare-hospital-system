import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const patient = await prisma.patient.create({
      data: {
        userId: body.userId,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender || "OTHER",
        phone: body.phone || null,
        address: body.address || null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : new Date(),
        bloodType: body.bloodType || null,
        insurance: body.insurance || null,
        emergencyContact: body.emergencyContact || null,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
