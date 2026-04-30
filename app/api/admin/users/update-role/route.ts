// /app/api/admin/users/update-role/route.ts

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  // 🔐 Only admins can change roles
  if (session?.user?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 403 })
  }

  const { userId, roleId } = await req.json()

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: roleId },
  })

  return Response.json(updatedUser)
}