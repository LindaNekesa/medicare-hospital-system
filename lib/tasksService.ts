import { prisma } from "@/lib/prisma"

export type CreateTaskInput = {
  title: string
  description?: string
  assignedToId: string   // staff user
  createdById: string    // admin/staff
  dueDate?: Date
}

export type UpdateTaskInput = {
  taskId: string
  title?: string
  description?: string
  status?: "TODO" | "IN_PROGRESS" | "DONE"
  dueDate?: Date
}

// 📌 Create Task
export async function createTask(data: CreateTaskInput) {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      assignedToId: data.assignedToId,
      createdById: data.createdById,
      dueDate: data.dueDate,
      status: "TODO",
    },
  })
}

// 📌 Get all tasks (admin view)
export async function getAllTasks() {
  return await prisma.task.findMany({
    include: {
      assignedTo: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

// 📌 Get tasks assigned to a specific user
export async function getUserTasks(userId: string) {
  return await prisma.task.findMany({
    where: { assignedToId: userId },
    include: {
      createdBy: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  })
}

// 📌 Update task
export async function updateTask(data: UpdateTaskInput) {
  return await prisma.task.update({
    where: { id: data.taskId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.dueDate && { dueDate: data.dueDate }),
    },
  })
}

// 📌 Delete task
export async function deleteTask(taskId: string) {
  return await prisma.task.delete({
    where: { id: taskId },
  })
}

// 📌 Get tasks by status (useful for dashboard columns)
export async function getTasksByStatus(status: "TODO" | "IN_PROGRESS" | "DONE") {
  return await prisma.task.findMany({
    where: { status },
    include: {
      assignedTo: true,
    },
  })
}