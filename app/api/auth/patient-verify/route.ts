import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// POST /api/auth/patient-verify
// Body: { nationalId: string, otp: string }
// Verifies OTP, issues JWT session token
export async function POST(req: NextRequest) {
  try {
    const { nationalId, otp } = await req.json();

    if (!nationalId?.trim() || !otp?.trim()) {
      return NextResponse.json({ error: "National ID and OTP are required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { nationalId: nationalId.trim().toUpperCase() },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check OTP exists
    if (!patient.otpCode || !patient.otpExpiry) {
      return NextResponse.json(
        { error: "No OTP requested. Please request a new OTP first." },
        { status: 400 }
      );
    }

    // Check OTP expiry (10 minutes)
    if (new Date() > patient.otpExpiry) {
      // Clear expired OTP
      await prisma.patient.update({
        where: { id: patient.id },
        data: { otpCode: null, otpExpiry: null, otpVerified: false },
      });
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 401 }
      );
    }

    // Check OTP matches
    if (patient.otpCode !== otp.trim()) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 401 });
    }

    // OTP valid — mark as verified and clear it
    await prisma.patient.update({
      where: { id: patient.id },
      data: { otpCode: null, otpExpiry: null, otpVerified: true },
    });

    // Issue JWT
    const token = jwt.sign(
      {
        id:         patient.user.id,
        email:      patient.user.email,
        name:       patient.user.name,
        role:       "PATIENT",
        patientId:  patient.id,
        nationalId: patient.nationalId,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );

    const userData = {
      id:         patient.user.id,
      name:       `${patient.firstName} ${patient.lastName}`,
      email:      patient.user.email,
      role:       "PATIENT",
      patientId:  patient.id,
      nationalId: patient.nationalId,
      phone:      patient.user.phone || patient.phone,
    };

    const response = NextResponse.json({ success: true, user: userData, token });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 8,
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/patient-verify]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
