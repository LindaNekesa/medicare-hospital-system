import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all settings
export async function GET() {
  const settings = await prisma.setting.findMany()
  return NextResponse.json(settings)
}

// POST: create a new setting
export async function POST(req: NextRequest) {
  const data = await req.json()
  const newSetting = await prisma.setting.create({
    data: {
      key: data.key,
      value: data.value,
      description: data.description || "",
    },
  })
  return NextResponse.json(newSetting)
}

// PATCH: update a setting
export async function PATCH(req: NextRequest) {
  const data = await req.json()
  const updatedSetting = await prisma.setting.update({
    where: { id: data.id },
    data: {
      value: data.value,
      key: data.key,
      description: data.description,
    },
  })
  return NextResponse.json(updatedSetting)
}

// DELETE: delete a setting
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const deleted = await prisma.setting.delete({ where: { id } })
  return NextResponse.json(deleted)
}