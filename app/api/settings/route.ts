import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET hospital settings (returns first record or defaults)
export async function GET() {
  try {
    let settings = await prisma.hospitalSettings.findFirst();
    if (!settings) {
      settings = await prisma.hospitalSettings.create({
        data: { hospitalName: "Medicare Hospital", emailNotifications: "ENABLED" },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PATCH: update hospital settings
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    let settings = await prisma.hospitalSettings.findFirst();

    if (settings) {
      settings = await prisma.hospitalSettings.update({
        where: { id: settings.id },
        data: {
          hospitalName: data.hospitalName ?? settings.hospitalName,
          emailNotifications: data.emailNotifications ?? settings.emailNotifications,
        },
      });
    } else {
      settings = await prisma.hospitalSettings.create({
        data: {
          hospitalName: data.hospitalName || "Medicare Hospital",
          emailNotifications: data.emailNotifications || "ENABLED",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
