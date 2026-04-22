import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET": {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(users);
    }

    case "POST": {
      const { name, email, password, role, phone } = req.body;
      const newUser = await prisma.user.create({
        data: { name, email, password, role, phone },
      });
      return res.status(201).json(newUser);
    }

    case "PUT": {
      const { id, ...updateData } = req.body;
      // Strip fields that don't exist on User
      const { departmentId: _d, department: _dep, ...safeData } = updateData;
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: safeData,
      });
      return res.status(200).json(updatedUser);
    }

    case "DELETE": {
      const { userId } = req.body;
      await prisma.user.delete({ where: { id: Number(userId) } });
      return res.status(204).end();
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
