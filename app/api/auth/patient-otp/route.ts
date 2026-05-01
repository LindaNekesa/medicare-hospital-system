import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/patient-otp
// Body: { nationalId: string }
// Finds the patient by national ID, generates OTP, stores it with 10-min expiry
// In production: send OTP via SMS/email. In dev: return it in the response.
export async function POST(req: NextRequest) {
  try {
    const { nationalId } = await req.json();

    if (!nationalId?.trim()) {
      return NextResponse.json({ error: "National ID is required" }, { status: 400 });
    }

    // Find patient by national ID
    const patient = await prisma.patient.findUnique({
      where: { nationalId: nationalId.trim().toUpperCase() },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, role: true } },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "No patient record found for this ID. Please register at the reception desk." },
        { status: 404 }
      );
    }

    // Generate OTP and set 10-minute expiry
    const otp     = generateOTP();
    const expiry  = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        otpCode:     otp,
        otpExpiry:   expiry,
        otpVerified: false,
      },
    });

    // In production: send OTP via SMS to patient.user.phone
    // For now: log to console and return masked info
    console.log(`[OTP] Patient: ${patient.firstName} ${patient.lastName} | OTP: ${otp} | Expires: ${expiry.toISOString()}`);

    // Return masked phone for display (e.g. "07***678")
    const phone = patient.user.phone || patient.phone || "";
    const maskedPhone = phone.length > 4
      ? phone.slice(0, 2) + "***" + phone.slice(-3)
      : "registered number";

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${maskedPhone}`,
      patientName: `${patient.firstName} ${patient.lastName}`,
      // DEV ONLY — remove in production:
      devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
      expiresIn: 600, // seconds
    });
  } catch (error) {
    console.error("[POST /api/auth/patient-otp]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
