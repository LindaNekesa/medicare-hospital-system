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
  await prisma.patient.upsert({ where:{userId:pat.id}, update:{}, create:{userId:pat.id,firstName:'John',lastName:'Doe',gender:'MALE',dateOfBirth:new Date('1985-06-15'),bloodType:'O+',phone:'0733333333',nationalId:'12345678'} });

  const cg = await prisma.user.upsert({ where:{email:'caregiver@medicare.com'}, update:{}, create:{name:'Mary Caregiver',email:'caregiver@medicare.com',password:await h('Care1234!'),role:'CAREGIVER'} });
  await prisma.caregiver.upsert({ where:{userId:cg.id}, update:{}, create:{userId:cg.id,relation:'Family Member'} });

  const ins = await prisma.user.upsert({ where:{email:'insurance@medicare.com'}, update:{}, create:{name:'NHIF Rep',email:'insurance@medicare.com',password:await h('Insure1234!'),role:'INSURANCE'} });
  await prisma.insuranceRep.upsert({ where:{userId:ins.id}, update:{}, create:{userId:ins.id,company:'NHIF Kenya'} });

  const gov = await prisma.user.upsert({ where:{email:'gov@medicare.com'}, update:{}, create:{name:'MOH Inspector',email:'gov@medicare.com',password:await h('Gov1234!'),role:'GOVERNMENT'} });
  await prisma.governmentRep.upsert({ where:{userId:gov.id}, update:{}, create:{userId:gov.id,agency:'Ministry of Health',position:'Health Inspector'} });

  // Radiographer
  const radio = await prisma.user.upsert({ where:{email:'radiographer@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Grace Adhiambo',email:'radiographer@medicare.com',password:await h('Radio1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:radio.id}, update:{staffType:'RADIOGRAPHER'}, create:{userId:radio.id,staffType:'RADIOGRAPHER',specialty:'Diagnostic Radiology',department:'Radiology & Imaging'} });

  // Pharmacist
  const pharma = await prisma.user.upsert({ where:{email:'pharmacy@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Kevin Ochieng',email:'pharmacy@medicare.com',password:await h('Pharma1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:pharma.id}, update:{staffType:'PHARMACIST'}, create:{userId:pharma.id,staffType:'PHARMACIST',specialty:'Clinical Pharmacy',department:'Pharmacy'} });

  // Physiotherapist
  const physio = await prisma.user.upsert({ where:{email:'physio@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Amina Waweru',email:'physio@medicare.com',password:await h('Physio1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:physio.id}, update:{staffType:'PHYSIOTHERAPIST'}, create:{userId:physio.id,staffType:'PHYSIOTHERAPIST',specialty:'Musculoskeletal Physiotherapy',department:'Physiotherapy'} });

  // Paramedic / Emergency
  const para = await prisma.user.upsert({ where:{email:'paramedic@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Brian Mutua',email:'paramedic@medicare.com',password:await h('Para1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:para.id}, update:{staffType:'PARAMEDIC'}, create:{userId:para.id,staffType:'PARAMEDIC',specialty:'Emergency Medicine',department:'Emergency & Casualty'} });

  // Receptionist
  const recep = await prisma.user.upsert({ where:{email:'reception@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Mary Anne Njeri',email:'reception@medicare.com',password:await h('Recep1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:recep.id}, update:{staffType:'RECEPTIONIST'}, create:{userId:recep.id,staffType:'RECEPTIONIST',department:'Front Office'} });

  // Dental Officer
  const dental = await prisma.user.upsert({ where:{email:'dental@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Dr. Faith Kamau',email:'dental@medicare.com',password:await h('Dental1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:dental.id}, update:{staffType:'DENTAL_OFFICER'}, create:{userId:dental.id,staffType:'DENTAL_OFFICER',specialty:'General Dentistry',department:'Dental'} });

  // Social Worker
  const social = await prisma.user.upsert({ where:{email:'socialwork@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Ruth Akinyi',email:'socialwork@medicare.com',password:await h('Social1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:social.id}, update:{staffType:'SOCIAL_WORKER'}, create:{userId:social.id,staffType:'SOCIAL_WORKER',specialty:'Medical Social Work',department:'Social Work'} });

  // Lab Technician
  const labtech = await prisma.user.upsert({ where:{email:'labtech@medicare.com'}, update:{role:'MEDICAL_STAFF'}, create:{name:'Dennis Otieno',email:'labtech@medicare.com',password:await h('Lab1234!'),role:'MEDICAL_STAFF'} });
  await prisma.medicalStaff.upsert({ where:{userId:labtech.id}, update:{staffType:'LAB_TECH'}, create:{userId:labtech.id,staffType:'LAB_TECH',specialty:'Clinical Laboratory Science',department:'Laboratory'} });

  console.log('\nSeed complete! All accounts:');
  console.log('  erimalinda26@gmail.com    Linda@2000   (ADMIN — Linda Nekesa)');
  console.log('  admin@medicare.com        Admin1234!   (ADMIN)');
  console.log('  management@medicare.com   Mgmt1234!    (HOSPITAL_MANAGEMENT)');
  console.log('  doctor@medicare.com       Doctor1234!  (MEDICAL_STAFF — DOCTOR)');
  console.log('  nurse@medicare.com        Nurse1234!   (MEDICAL_STAFF — NURSE)');
  console.log('  radiographer@medicare.com Radio1234!   (MEDICAL_STAFF — RADIOGRAPHER)');
  console.log('  pharmacy@medicare.com     Pharma1234!  (MEDICAL_STAFF — PHARMACIST)');
  console.log('  physio@medicare.com       Physio1234!  (MEDICAL_STAFF — PHYSIOTHERAPIST)');
  console.log('  paramedic@medicare.com    Para1234!    (MEDICAL_STAFF — PARAMEDIC)');
  console.log('  reception@medicare.com    Recep1234!   (MEDICAL_STAFF — RECEPTIONIST)');
  console.log('  dental@medicare.com       Dental1234!  (MEDICAL_STAFF — DENTAL_OFFICER)');
  console.log('  socialwork@medicare.com   Social1234!  (MEDICAL_STAFF — SOCIAL_WORKER)');
  console.log('  labtech@medicare.com      Lab1234!     (MEDICAL_STAFF — LAB_TECH)');
  console.log('  patient@medicare.com      Patient1234! (PATIENT)');
  console.log('  caregiver@medicare.com    Care1234!    (CAREGIVER)');
  console.log('  insurance@medicare.com    Insure1234!  (INSURANCE)');
  console.log('  gov@medicare.com          Gov1234!     (GOVERNMENT)');
}

main().catch(console.error).finally(() => prisma.$disconnect());
