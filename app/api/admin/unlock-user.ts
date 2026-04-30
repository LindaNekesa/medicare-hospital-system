import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 })
  }

  const { userId } = await req.json()

  await prisma.user.update({
    where: { id: userId },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
    },
  })

  return Response.json({ success: true })
}