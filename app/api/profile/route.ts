import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function getUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value
    || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

// GET — fetch own profile
export async function GET(req: NextRequest) {
  const payload = getUser(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true,
      medicalStaff: { select: { staffType: true, specialty: true, department: true, licenseNo: true } },
      patient: { select: { firstName: true, lastName: true, gender: true, dateOfBirth: true, bloodType: true, address: true, phone: true, insurance: true, emergencyContact: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}

// PATCH — update profile
export async function PATCH(req: NextRequest) {
  const payload = getUser(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, bio, staffType, specialty, department, licenseNo,
    firstName, lastName, gender, dateOfBirth, bloodType, address, insurance, emergencyContact } = body;

  const user = await prisma.user.update({
    where: { id: payload.id },
    data: { name: name || undefined, phone: phone || undefined },
    select: { id: true, name: true, email: true, role: true, phone: true },
  });

  // Update role-specific profile
  if (user.role === "MEDICAL_STAFF") {
    await prisma.medicalStaff.upsert({
      where: { userId: payload.id },
      update: { staffType: staffType || undefined, specialty: specialty || undefined, department: department || undefined, licenseNo: licenseNo || undefined },
      create: { userId: payload.id, staffType: staffType || "DOCTOR", specialty, department, licenseNo },
    });
  }

  if (user.role === "PATIENT" && firstName) {
    await prisma.patient.upsert({
      where: { userId: payload.id },
      update: { firstName, lastName, gender, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, bloodType, address, phone, insurance, emergencyContact },
      create: { userId: payload.id, firstName, lastName: lastName || "", gender: gender || "OTHER", dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(), bloodType, address, phone, insurance, emergencyContact },
    });
  }

  return NextResponse.json({ success: true, user });
}

// DELETE — delete own account
export async function DELETE(req: NextRequest) {
  const payload = getUser(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Prevent deleting the main admin
  if (payload.email === "erimalinda26@gmail.com") {
    return NextResponse.json({ error: "This account cannot be deleted." }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: payload.id } });
  const res = NextResponse.json({ success: true });
  res.cookies.delete("auth_token");
  return res;
}
