import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const h = (p: string) => bcrypt.hash(p, 10);

async function main() {
  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@medicare.com' }, update: {},
    create: { name: 'System Admin', email: 'admin@medicare.com', password: await h('Admin1234!'), role: 'ADMIN' },
  });

  // Hospital Management
  await prisma.user.upsert({
    where: { email: 'management@medicare.com' }, update: {},
    create: { name: 'James Omondi', email: 'management@medicare.com', password: await h('Mgmt1234!'), role: 'HOSPITAL_MANAGEMENT' },
  });

  // Doctor
  const doc = await prisma.user.upsert({
    where: { email: 'doctor@medicare.com' }, update: {},
    create: { name: 'Dr. Sarah Johnson', email: 'doctor@medicare.com', password: await h('Doctor1234!'), role: 'MEDICAL_STAFF' },
  });
  await prisma.medicalStaff.upsert({
    where: { userId: doc.id }, update: {},
    create: { userId: doc.id, staffType: 'DOCTOR', specialty: 'Cardiology', department: 'Cardiology' },
  });

  // Nurse
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@medicare.com' }, update: {},
    create: { name: 'Emma Wilson', email: 'nurse@medicare.com', password: await h('Nurse1234!'), role: 'MEDICAL_STAFF' },
  });
  await prisma.medicalStaff.upsert({
    where: { userId: nurse.id }, update: {},
    create: { userId: nurse.id, staffType: 'NURSE', department: 'General' },
  });

  // Patient
  const pat = await prisma.user.upsert({
    where: { email: 'patient@medicare.com' }, update: {},
    create: { name: 'John Doe', email: 'patient@medicare.com', password: await h('Patient1234!'), role: 'PATIENT' },
  });
  await prisma.patient.upsert({
    where: { userId: pat.id }, update: {},
    create: { userId: pat.id, firstName: 'John', lastName: 'Doe', gender: 'MALE', dateOfBirth: new Date('1985-06-15'), bloodType: 'O+', phone: '0733333333' },
  });

  // Caregiver
  const cg = await prisma.user.upsert({
    where: { email: 'caregiver@medicare.com' }, update: {},
    create: { name: 'Mary Caregiver', email: 'caregiver@medicare.com', password: await h('Care1234!'), role: 'CAREGIVER' },
  });
  await prisma.caregiver.upsert({
    where: { userId: cg.id }, update: {},
    create: { userId: cg.id, relation: 'Family Member' },
  });

  // Insurance
  const ins = await prisma.user.upsert({
    where: { email: 'insurance@medicare.com' }, update: {},
    create: { name: 'NHIF Rep', email: 'insurance@medicare.com', password: await h('Insure1234!'), role: 'INSURANCE' },
  });
  await prisma.insuranceRep.upsert({
    where: { userId: ins.id }, update: {},
    create: { userId: ins.id, company: 'NHIF Kenya' },
  });

  // Government
  const gov = await prisma.user.upsert({
    where: { email: 'gov@medicare.com' }, update: {},
    create: { name: 'MOH Inspector', email: 'gov@medicare.com', password: await h('Gov1234!'), role: 'GOVERNMENT' },
  });
  await prisma.governmentRep.upsert({
    where: { userId: gov.id }, update: {},
    create: { userId: gov.id, agency: 'Ministry of Health', position: 'Health Inspector' },
  });

  console.log('\nSeed complete!');
  console.log('  ADMIN             admin@medicare.com        Admin1234!');
  console.log('  HOSPITAL_MGMT     management@medicare.com   Mgmt1234!');
  console.log('  MEDICAL_STAFF     doctor@medicare.com       Doctor1234!');
  console.log('  PATIENT           patient@medicare.com      Patient1234!');
  console.log('  CAREGIVER         caregiver@medicare.com    Care1234!');
  console.log('  INSURANCE         insurance@medicare.com    Insure1234!');
  console.log('  GOVERNMENT        gov@medicare.com          Gov1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
