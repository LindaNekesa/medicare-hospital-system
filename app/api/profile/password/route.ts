import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/rbac";

export async function POST(req: NextRequest) {
  const session = await auth(req);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword, userId } = body;

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Determine target user
  let targetId: number = session.user.id;

  if (userId !== undefined) {
    if (!isAdmin(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    targetId = parseInt(userId, 10);
    if (isNaN(targetId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Non-admin must verify their current password
  if (!isAdmin(session.user.role)) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: targetId },
    data:  { password: hashed },
  });

  return NextResponse.json({ success: true });
}
