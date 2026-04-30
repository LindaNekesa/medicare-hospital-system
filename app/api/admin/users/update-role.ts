// /api/admin/users/update-role
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { userId, roleId } = await req.json()

  await prisma.user.update({
    where: { id: userId },
    data: { role:roleId },
  })

  return new Response("Role updated")
}