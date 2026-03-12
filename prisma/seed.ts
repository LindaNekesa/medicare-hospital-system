// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Delete existing records (optional)
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();

  // Seed Patients
  const patients = await prisma.patient.createMany({
    data: [
      { name: "John Doe", age: 34, gender: "Male", condition: "Flu" },
      { name: "Jane Smith", age: 29, gender: "Female", condition: "Diabetes" },
      { name: "Robert Johnson", age: 45, gender: "Male", condition: "Hypertension" },
      { name: "Emily Clark", age: 38, gender: "Female", condition: "Pregnancy" },
    ],
  });

  // Seed Appointments
  const appointments = await prisma.appointment.createMany({
    data: [
      { patientId: 1, doctor: "Dr. Mark Lee", date: new Date("2026-03-12T10:00:00"), status: "Confirmed" },
      { patientId: 2, doctor: "Dr. Emily Clark", date: new Date("2026-03-13T14:00:00"), status: "Pending" },
      { patientId: 3, doctor: "Dr. Mark Lee", date: new Date("2026-03-14T11:30:00"), status: "Cancelled" },
      { patientId: 4, doctor: "Dr. Emily Clark", date: new Date("2026-03-15T09:00:00"), status: "Confirmed" },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });