import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case "GET":
      const users = await prisma.user.findMany({ include: { department: true } })
      return res.status(200).json(users)

    case "POST":
      const { name, email, password, role, phone, departmentId } = req.body
      const newUser = await prisma.user.create({
        data: { name, email, password, role, phone, departmentId }
      })
      return res.status(201).json(newUser)

    case "PUT":
      const { id, ...updateData } = req.body
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
      })
      return res.status(200).json(updatedUser)

    case "DELETE":
      const { userId } = req.body
      await prisma.user.delete({ where: { id: userId } })
      return res.status(204).end()

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}