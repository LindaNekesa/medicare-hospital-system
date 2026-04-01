import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const pw1 = await bcrypt.hash("Admin1234!", 10);
const pw2 = await bcrypt.hash("Doctor1234!", 10);

await prisma.user.upsert({ where:{email:"admin@medicare.com"}, update:{}, create:{name:"Admin User",email:"admin@medicare.com",password:pw1,role:"ADMIN"} });
await prisma.user.upsert({ where:{email:"doctor@medicare.com"}, update:{}, create:{name:"Dr. Sarah Johnson",email:"doctor@medicare.com",password:pw2,role:"DOCTOR"} });

console.log("Seed complete! admin@medicare.com / Admin1234!");
await prisma.$disconnect();
