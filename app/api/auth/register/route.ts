import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Password rule: min 8 chars, starts with uppercase, contains lowercase + special char
export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/^[A-Z]/.test(password)) return "Password must begin with a capital letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character (e.g. @, #, !).";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, role, staffType, dbRole } = await request.json();

    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json({ error: "Name, email, phone, password and role are required." }, { status: 400 });
    }

    const pwError = validatePassword(password);
    if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

    if (!email.toLowerCase().endsWith("@medicare.com")) {
      return NextResponse.json({ error: "Email must use the @medicare.com domain." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    // Use dbRole if provided (clinical roles map to MEDICAL_STAFF in DB)
    const finalRole = dbRole || role;
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashed, role: finalRole },
    });

    // Create role-specific profile
    if (finalRole === "MEDICAL_STAFF" && staffType) {
      await prisma.medicalStaff.create({
        data: { userId: user.id, staffType, specialty: null, department: null },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, displayRole: role },
      process.env.JWT_SECRET || "medicare-jwt-secret-2024",
      { expiresIn: "8h" }
    );

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    }, { status: 201 });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
