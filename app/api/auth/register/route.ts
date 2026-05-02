import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validatePassword } from "@/lib/utils/validatePassword";

// 🔐 REGISTER USER
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, role, staffType, dbRole } =
      await request.json();

    // 1️⃣ Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, phone, password and role are required." },
        { status: 400 }
      );
    }

    // 2️⃣ Password validation
    const pwError = validatePassword(password);
    if (pwError) {
      return NextResponse.json({ error: pwError }, { status: 400 });
    }

    // 3️⃣ Email domain restriction
    if (!email.toLowerCase().endsWith("@medicare.com")) {
      return NextResponse.json(
        { error: "Email must use @medicare.com domain." },
        { status: 400 }
      );
    }

    // 4️⃣ Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    // 5️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Determine role
    const finalRole = dbRole || role;

    // 7️⃣ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: finalRole,
      },
    });

    // 8️⃣ Optional: create medical staff profile
    if (finalRole === "MEDICAL_STAFF" && staffType) {
      await prisma.medicalStaff.create({
        data: {
          userId: user.id,
          staffType,
          specialty: null,
          department: null,
        },
      });
    }

    // 9️⃣ Generate JWT token — include staffType for dashboard routing
    const token = jwt.sign(
      {
        id:        user.id,
        email:     user.email,
        name:      user.name,
        role:      user.role,
        staffType: staffType ?? null,
      },
      process.env.JWT_SECRET || "medicare-jwt-secret",
      { expiresIn: "8h" }
    );

    // 🔟 Response — include staffType so dashboard router works immediately
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id:        user.id,
          name:      user.name,
          email:     user.email,
          role:      user.role,
          staffType: staffType ?? null,
        },
        token,
      },
      { status: 201 }
    );

    // 🍪 Set cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}