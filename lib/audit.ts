import { prisma } from "@/lib/prisma"

export async function logAction({
  userId,
  action,
  entity,
  entityId,
  hospitalId,
}: {
  userId: string
  action: string
  entity: string
  entityId: string
  hospitalId: string
}) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      hospitalId,
    },
  })
}