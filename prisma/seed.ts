import { prisma } from "@/lib/prisma"

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      permissions: {
        create: [
          { action: "edit_patient" },
          { action: "delete_patient" },
          { action: "view_reports" },
        ],
      },
    },
  })

  const staffRole = await prisma.role.upsert({
    where: { name: "staff" },
    update: {},
    create: {
      name: "staff",
      permissions: {
        create: [
          { action: "edit_patient" },
        ],
      },
    },
  })

  console.log("Seeded roles:", adminRole, staffRole)
}

main()