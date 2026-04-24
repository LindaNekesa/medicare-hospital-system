import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const session = await auth(req);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const userIdParam = searchParams.get("userId");

  // Default to the logged-in user's id
  let targetId: number = session.user.id;

  if (userIdParam) {
    if (!canManageUsers(session.user.role)) {
      // Non-admin trying to view someone else's profile
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    targetId = parseInt(userIdParam, 10);
    if (isNaN(targetId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: {
      id:        true,
      name:      true,
      email:     true,
      role:      true,
      phone:     true,
      createdAt: true,
      medicalStaff: {
        select: { staffType: true, specialty: true, department: true },
      },
      patient: {
        select: { firstName: true, lastName: true, gender: true, bloodType: true, phone: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth(req);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone } = body;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name  !== undefined && { name:  name.trim() }),
      ...(phone !== undefined && { phone: phone || null }),
    },
    select: { id: true, name: true, email: true, phone: true, updatedAt: true },
  });

  return NextResponse.json(updated);
}
