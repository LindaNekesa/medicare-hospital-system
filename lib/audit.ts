import { prisma } from "@/lib/prisma"

export async function logAction({
  userId,
  action,
  entity,
  entityId,
}: {
  userId: number
  action: string
  entity: string
  entityId?: number
}) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId: entityId ?? null,
    },
  })
}
