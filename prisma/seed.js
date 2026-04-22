const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const h = (p) => bcrypt.hash(p, 10);

async function main() {
  // ── Linda Nekesa — pre-seeded admin, no registration needed ──────────────
  await prisma.user.upsert({
    where: { email: 'erimalinda26@gmail.com' },
    update: { role: 'ADMIN', name: 'Linda Nekesa' },
    create: { name: 'Linda Nekesa', email: 'erimalinda26@gmail.com', password: await h('Linda@2000'), role: 'ADMIN' },
  });

  await prisma.user.upsert({ where:{email:'admin@medicare.com'}, update:{}, create:{name:'System Admin',email:'admin@medicare.com',password:await h('Admin1234!'),role:'ADMIN'} });
  await prisma.user.upsert({ where:{email:'management@medicare.com'}, update:{}, create:{name:'James Omondi',email:'management@medicare.com',password:await h('Mgmt1234!'),role:'HOSPITAL_MANAGEMENT'} });

  const doc = await prisma.user.upsert({ where:{email:'doctor@medicare.com'}, update:{}, create:{name:'Dr. Sarah Johnson',email:'doctor@medicare.com',password:await h('Doctor1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:doc.id}, update:{}, create:{userId:doc.id,staffType:'DOCTOR',specialty:'Cardiology',department:'Cardiology'} });

  const nurse = await prisma.user.upsert({ where:{email:'nurse@medicare.com'}, update:{}, create:{name:'Emma Wilson',email:'nurse@medicare.com',password:await h('Nurse1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:nurse.id}, update:{}, create:{userId:nurse.id,staffType:'NURSE',department:'General'} });

  const pat = await prisma.user.upsert({ where:{email:'patient@medicare.com'}, update:{}, create:{name:'John Doe',email:'patient@medicare.com',password:await h('Patient1234!'),role:'PATIENT'} });
  await prisma.patient.upsert({ where:{userId:pat.id}, update:{}, create:{userId:pat.id,firstName:'John',lastName:'Doe',gender:'MALE',dateOfBirth:new Date('1985-06-15'),bloodType:'O+',phone:'0733333333'} });

  const cg = await prisma.user.upsert({ where:{email:'caregiver@medicare.com'}, update:{}, create:{name:'Mary Caregiver',email:'caregiver@medicare.com',password:await h('Care1234!'),role:'CAREGIVER'} });
  await prisma.caregiver.upsert({ where:{userId:cg.id}, update:{}, create:{userId:cg.id,relation:'Family Member'} });

  const ins = await prisma.user.upsert({ where:{email:'insurance@medicare.com'}, update:{}, create:{name:'NHIF Rep',email:'insurance@medicare.com',password:await h('Insure1234!'),role:'INSURANCE'} });
  await prisma.insuranceRep.upsert({ where:{userId:ins.id}, update:{}, create:{userId:ins.id,company:'NHIF Kenya'} });

  const gov = await prisma.user.upsert({ where:{email:'gov@medicare.com'}, update:{}, create:{name:'MOH Inspector',email:'gov@medicare.com',password:await h('Gov1234!'),role:'GOVERNMENT'} });
  await prisma.governmentRep.upsert({ where:{userId:gov.id}, update:{}, create:{userId:gov.id,agency:'Ministry of Health',position:'Health Inspector'} });

  // Radiographer
  const radio = await prisma.user.upsert({ where:{email:'radiographer@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Grace Adhiambo',email:'radiographer@medicare.com',password:await h('Radio1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:radio.id}, update:{staffType:'RADIOGRAPHER'}, create:{userId:radio.id,staffType:'RADIOGRAPHER',specialty:'Diagnostic Radiology',department:'Radiology & Imaging'} });

  console.log('\nSeed complete!');
  console.log('  admin@medicare.com        Admin1234!   (ADMIN)');
  console.log('  management@medicare.com   Mgmt1234!    (HOSPITAL_MANAGEMENT)');
  console.log('  doctor@medicare.com       Doctor1234!  (MEDICAL_STAFF)');
  console.log('  patient@medicare.com      Patient1234! (PATIENT)');
  console.log('  caregiver@medicare.com    Care1234!    (CAREGIVER)');
  console.log('  insurance@medicare.com    Insure1234!  (INSURANCE)');
  console.log('  gov@medicare.com          Gov1234!     (GOVERNMENT)');
}

main().catch(console.error).finally(() => prisma.$disconnect());
