import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Include medicalStaff so we can return staffType for dashboard routing
    const user = await prisma.user.findUnique({
      where: { email },
      include: { medicalStaff: { select: { staffType: true, department: true, specialty: true } } },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const staffType = user.medicalStaff?.staffType ?? null;

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, staffType },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      staffType,
      department: user.medicalStaff?.department ?? null,
      specialty:  user.medicalStaff?.specialty  ?? null,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      token,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
