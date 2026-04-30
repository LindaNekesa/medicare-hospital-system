import { prisma } from "@/lib/prisma"

export type CreateTaskInput = {
  title: string
  description?: string
  assignedTo?: number   // User.id
  dueDate?: Date
}

export type UpdateTaskInput = {
  taskId: number
  title?: string
  description?: string
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  dueDate?: Date
}

// Create Task
export async function createTask(data: CreateTaskInput) {
  return await prisma.task.create({
    data: {
      title:       data.title,
      description: data.description ?? null,
      assignedTo:  data.assignedTo  ?? null,
      dueDate:     data.dueDate     ?? null,
      status:      "PENDING",
    },
  })
}

// Get all tasks
export async function getAllTasks() {
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  })
}

// Get tasks assigned to a specific user
export async function getUserTasks(userId: number) {
  return await prisma.task.findMany({
    where:   { assignedTo: userId },
    orderBy: { dueDate: "asc" },
  })
}

// Update task
export async function updateTask(data: UpdateTaskInput) {
  return await prisma.task.update({
    where: { id: data.taskId },
    data: {
      ...(data.title       !== undefined && { title:       data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status      !== undefined && { status:      data.status }),
      ...(data.dueDate     !== undefined && { dueDate:     data.dueDate }),
    },
  })
}

// Delete task
export async function deleteTask(taskId: number) {
  return await prisma.task.delete({
    where: { id: taskId },
  })
}

// Get tasks by status
export async function getTasksByStatus(status: "PENDING" | "IN_PROGRESS" | "COMPLETED") {
  return await prisma.task.findMany({
    where:   { status },
    orderBy: { dueDate: "asc" },
  })
}
