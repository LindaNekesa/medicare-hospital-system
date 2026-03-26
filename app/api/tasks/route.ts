import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all tasks
export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { assignedTo: true },
    orderBy: { dueDate: "asc" },
  })
  return NextResponse.json(tasks)
}

// POST: create task
export async function POST(req: NextRequest) {
  const data = await req.json()
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || "PENDING",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedToId: data.assignedToId,
    },
  })
  return NextResponse.json(task)
}

// PATCH: update task status
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const updated = await prisma.task.update({
    where: { id },
    data: { status },
  })
  return NextResponse.json(updated)
}