export interface StaffTypeOption {
  value: string;
  label: string;
  department: string;
  category: string;
}

export const DEPARTMENTS = [
  "Accident & Emergency (A&E)",
  "Anaesthesiology",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Dental / Oral Health",
  "Dermatology",
  "Ear, Nose & Throat (ENT)",
  "Endocrinology",
  "Gastroenterology",
  "General Medicine",
  "General Surgery",
  "Gynaecology & Obstetrics",
  "Haematology",
  "ICU / Critical Care",
  "Infectious Diseases",
  "Laboratory / Pathology",
  "Mental Health / Psychiatry",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Nutrition & Dietetics",
  "Oncology",
  "Ophthalmology",
  "Orthopaedics",
  "Paediatrics",
  "Pharmacy",
  "Physiotherapy",
  "Radiology & Imaging",
  "Renal / Dialysis",
  "Respiratory / Pulmonology",
  "Rheumatology",
  "Social Work & Counselling",
  "Urology",
  "Ward / Nursing",
  "Administration & Records",
  "Support Services",
] as const;

export const STAFF_TYPES: StaffTypeOption[] = [
  // ── Clinical / Doctors ────────────────────────────────────────────────────
  { value: "DOCTOR",           label: "Medical Doctor (General)",       department: "General Medicine",          category: "Clinical" },
  { value: "SURGEON",          label: "Surgeon",                        department: "General Surgery",           category: "Clinical" },
  { value: "SPECIALIST",       label: "Medical Specialist",             department: "General Medicine",          category: "Clinical" },
  { value: "RESIDENT_DOCTOR",  label: "Resident Doctor",                department: "General Medicine",          category: "Clinical" },
  { value: "INTERN_DOCTOR",    label: "Intern Doctor",                  department: "General Medicine",          category: "Clinical" },
  { value: "ANESTHESIOLOGIST", label: "Anaesthesiologist",              department: "Anaesthesiology",           category: "Clinical" },
  { value: "ICU_SPECIALIST",   label: "ICU / Critical Care Specialist", department: "ICU / Critical Care",       category: "Clinical" },
  { value: "PSYCHIATRIST",     label: "Psychiatrist",                   department: "Mental Health / Psychiatry",category: "Clinical" },
  // ── Nursing ───────────────────────────────────────────────────────────────
  { value: "NURSE",            label: "Registered Nurse (RN)",          department: "Ward / Nursing",            category: "Nursing" },
  { value: "SENIOR_NURSE",     label: "Senior / Charge Nurse",          department: "Ward / Nursing",            category: "Nursing" },
  { value: "MIDWIFE",          label: "Midwife",                        department: "Gynaecology & Obstetrics",  category: "Nursing" },
  { value: "NURSE_ANESTHETIST",label: "Nurse Anaesthetist (CRNA)",      department: "Anaesthesiology",           category: "Nursing" },
  // ── Allied Health ─────────────────────────────────────────────────────────
  { value: "CLINICAL_OFFICER",       label: "Clinical Officer",              department: "General Medicine",          category: "Allied Health" },
  { value: "PHARMACIST",             label: "Pharmacist",                    department: "Pharmacy",                  category: "Allied Health" },
  { value: "PHARMACY_TECH",          label: "Pharmacy Technician",           department: "Pharmacy",                  category: "Allied Health" },
  { value: "LAB_TECH",               label: "Laboratory Technician",         department: "Laboratory / Pathology",    category: "Allied Health" },
  { value: "LAB_SCIENTIST",          label: "Medical Laboratory Scientist",  department: "Laboratory / Pathology",    category: "Allied Health" },
  { value: "RADIOLOGIST",            label: "Radiologist",                   department: "Radiology & Imaging",       category: "Allied Health" },
  { value: "RADIOGRAPHER",           label: "Radiographer / Sonographer",    department: "Radiology & Imaging",       category: "Allied Health" },
  { value: "PHYSIOTHERAPIST",        label: "Physiotherapist",               department: "Physiotherapy",             category: "Allied Health" },
  { value: "OCCUPATIONAL_THERAPIST", label: "Occupational Therapist",        department: "Physiotherapy",             category: "Allied Health" },
  { value: "NUTRITIONIST_DIETITIAN", label: "Nutritionist / Dietitian",      department: "Nutrition & Dietetics",     category: "Allied Health" },
  { value: "SPEECH_THERAPIST",       label: "Speech & Language Therapist",   department: "General Medicine",          category: "Allied Health" },
  { value: "OPTOMETRIST",            label: "Optometrist",                   department: "Ophthalmology",             category: "Allied Health" },
  { value: "DENTAL_OFFICER",         label: "Dental Officer",                department: "Dental / Oral Health",      category: "Allied Health" },
  { value: "DENTAL_TECH",            label: "Dental Technician",             department: "Dental / Oral Health",      category: "Allied Health" },
  // ── Emergency ─────────────────────────────────────────────────────────────
  { value: "PARAMEDIC", label: "Paramedic",                department: "Accident & Emergency (A&E)", category: "Emergency" },
  { value: "EMT",       label: "Emergency Medical Technician (EMT)", department: "Accident & Emergency (A&E)", category: "Emergency" },
  // ── Mental Health ─────────────────────────────────────────────────────────
  { value: "PSYCHOLOGIST", label: "Psychologist",          department: "Mental Health / Psychiatry", category: "Mental Health" },
  { value: "COUNSELOR",    label: "Counsellor / Therapist",department: "Social Work & Counselling",  category: "Mental Health" },
  // ── Admin & Support ───────────────────────────────────────────────────────
  { value: "RECEPTIONIST",             label: "Receptionist / Front Desk",      department: "Administration & Records", category: "Admin & Support" },
  { value: "MEDICAL_RECORDS_OFFICER",  label: "Medical Records Officer",        department: "Administration & Records", category: "Admin & Support" },
  { value: "HEALTH_INFORMATION_OFFICER",label: "Health Information Officer",    department: "Administration & Records", category: "Admin & Support" },
  { value: "SOCIAL_WORKER",            label: "Social Worker",                  department: "Social Work & Counselling",category: "Admin & Support" },
  { value: "CHAPLAIN",                 label: "Hospital Chaplain",              department: "Support Services",         category: "Admin & Support" },
  { value: "PORTER",                   label: "Hospital Porter",                department: "Support Services",         category: "Admin & Support" },
  { value: "CLEANER",                  label: "Cleaner / Housekeeper",          department: "Support Services",         category: "Admin & Support" },
  { value: "SECURITY",                 label: "Security Officer",               department: "Support Services",         category: "Admin & Support" },
];

// Group by category for display
export const STAFF_BY_CATEGORY = STAFF_TYPES.reduce<Record<string, StaffTypeOption[]>>((acc, s) => {
  if (!acc[s.category]) acc[s.category] = [];
  acc[s.category].push(s);
  return acc;
}, {});
