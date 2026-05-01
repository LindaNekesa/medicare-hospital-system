// Shared referral/service request store
// Doctor sends referrals to other departments — each department sees their own queue

export type Department =
  | "PHARMACY"
  | "RADIOLOGY"
  | "LABORATORY"
  | "PHYSIOTHERAPY"
  | "DENTAL"
  | "SOCIAL_WORK"
  | "NUTRITION"
  | "OPHTHALMOLOGY"
  | "EMERGENCY"
  | "ICU"
  | "THEATRE";

// ── Department-specific extra fields ─────────────────────────────────────────
export interface PharmacyExtra {
  medications: { drug: string; dose: string; frequency: string; duration: string; route: string }[];
  dispensingInstructions?: string;
}

export interface RadiologyExtra {
  imagingType: string;       // "Chest X-Ray" | "CT Scan" | "MRI" | "Ultrasound" | "Mammogram" | "Bone Scan"
  bodyPart: string;
  contrastRequired: boolean;
  clinicalIndication: string;
}

export interface LaboratoryExtra {
  tests: string[];           // ["FBC", "LFTs", "HbA1c", ...]
  specimenType: string;      // "Blood" | "Urine" | "Stool" | "Sputum" | "Swab"
  fastingRequired: boolean;
}

export interface PhysiotherapyExtra {
  condition: string;
  affectedArea: string;
  sessionsRequested: number;
  goals: string;
}

export interface DentalExtra {
  procedure: string;         // "Extraction" | "Filling" | "Scaling" | "Root Canal" | "Consultation"
  toothNumber?: string;
  xrayRequired: boolean;
}

export interface NutritionExtra {
  dietaryCondition: string;  // "Diabetes" | "Renal Failure" | "Malnutrition" | "Obesity" | "Post-op"
  currentWeight?: string;
  bmi?: string;
  goals: string;
}

export interface OphthalmologyExtra {
  complaint: string;         // "Blurred vision" | "Eye pain" | "Redness" | "Trauma"
  visualAcuity?: string;
  procedure?: string;        // "Refraction" | "Fundoscopy" | "Tonometry"
}

export interface SocialWorkExtra {
  socialIssue: string;       // "Financial hardship" | "Domestic violence" | "Elderly care" | "Mental health"
  urgencyReason: string;
  familyContact?: string;
}

export interface TheatreExtra {
  procedure: string;
  anaesthesiaType: string;   // "General" | "Spinal" | "Local" | "Sedation"
  estimatedDuration: string;
  bloodRequired: boolean;
  bloodUnits?: number;
}

export interface Referral {
  id: string;
  patientName: string;
  patientId: string;
  patientAge?: string;
  patientGender?: string;
  diagnosis?: string;
  fromDoctor: string;
  fromDepartment: string;
  toDepartment: Department;
  urgency: "ROUTINE" | "URGENT" | "STAT";
  reason: string;
  clinicalNotes: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "DECLINED";
  response?: string;
  sentAt: string;
  respondedAt?: string;
  // Department-specific structured data
  pharmacyData?:      PharmacyExtra;
  radiologyData?:     RadiologyExtra;
  laboratoryData?:    LaboratoryExtra;
  physiotherapyData?: PhysiotherapyExtra;
  dentalData?:        DentalExtra;
  nutritionData?:     NutritionExtra;
  ophthalmologyData?: OphthalmologyExtra;
  socialWorkData?:    SocialWorkExtra;
  theatreData?:       TheatreExtra;
}

const KEY = "medicare_referrals";

export function getReferrals(): Referral[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function saveReferrals(referrals: Referral[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(referrals));
}

export function addReferral(ref: Omit<Referral, "id" | "sentAt" | "status">): Referral {
  const all = getReferrals();
  const newRef: Referral = {
    ...ref,
    id: `REF-${Date.now()}`,
    status: "PENDING",
    sentAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  };
  saveReferrals([newRef, ...all]);
  return newRef;
}

export function updateReferral(id: string, updates: Partial<Referral>): void {
  const all = getReferrals();
  saveReferrals(all.map(r => r.id === id ? { ...r, ...updates } : r));
}

export function getReferralsByDepartment(dept: Department): Referral[] {
  return getReferrals().filter(r => r.toDepartment === dept);
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  PHARMACY:       "Pharmacy",
  RADIOLOGY:      "Radiology & Imaging",
  LABORATORY:     "Laboratory",
  PHYSIOTHERAPY:  "Physiotherapy",
  DENTAL:         "Dental",
  SOCIAL_WORK:    "Social Work",
  NUTRITION:      "Nutrition & Dietetics",
  OPHTHALMOLOGY:  "Ophthalmology",
  EMERGENCY:      "Emergency & Casualty",
  ICU:            "Intensive Care Unit",
  THEATRE:        "Theatre / Surgery",
};

export const DEPARTMENT_ICONS: Record<Department, string> = {
  PHARMACY:       "💊",
  RADIOLOGY:      "🩻",
  LABORATORY:     "🔬",
  PHYSIOTHERAPY:  "💪",
  DENTAL:         "🦷",
  SOCIAL_WORK:    "🤝",
  NUTRITION:      "🥗",
  OPHTHALMOLOGY:  "👁️",
  EMERGENCY:      "🚑",
  ICU:            "🏥",
  THEATRE:        "🔪",
};

// Common drug list for pharmacy referrals
export const COMMON_DRUGS = [
  "Amoxicillin 500mg", "Amoxicillin-Clavulanate 625mg", "Azithromycin 500mg",
  "Ciprofloxacin 500mg", "Metronidazole 400mg", "Doxycycline 100mg",
  "Paracetamol 500mg", "Ibuprofen 400mg", "Diclofenac 50mg", "Tramadol 50mg",
  "Morphine 10mg", "Codeine 30mg",
  "Amlodipine 5mg", "Atenolol 50mg", "Lisinopril 10mg", "Losartan 50mg",
  "Furosemide 40mg", "Hydrochlorothiazide 25mg", "Spironolactone 25mg",
  "Metformin 500mg", "Glibenclamide 5mg", "Insulin (Actrapid)", "Insulin (Mixtard)",
  "Salbutamol Inhaler", "Beclomethasone Inhaler", "Prednisolone 5mg",
  "Omeprazole 20mg", "Ranitidine 150mg", "Metoclopramide 10mg",
  "Chlorphenamine 4mg", "Cetirizine 10mg", "Loratadine 10mg",
  "Artemether-Lumefantrine (Coartem)", "Quinine 300mg", "Fansidar",
  "Cotrimoxazole 480mg", "Fluconazole 150mg", "Acyclovir 200mg",
  "Ferrous Sulphate 200mg", "Folic Acid 5mg", "Vitamin B Complex",
  "ORS Sachets", "Zinc Sulphate 20mg", "Vitamin A 200,000 IU",
  "Warfarin 5mg", "Aspirin 75mg", "Clopidogrel 75mg",
  "Atorvastatin 20mg", "Simvastatin 20mg",
  "Diazepam 5mg", "Phenobarbitone 30mg", "Carbamazepine 200mg",
];

export const IMAGING_TYPES = [
  "Chest X-Ray (PA)", "Chest X-Ray (AP)", "Abdominal X-Ray",
  "Skull X-Ray", "Spine X-Ray (Cervical)", "Spine X-Ray (Lumbar)",
  "Pelvis X-Ray", "Limb X-Ray",
  "CT Scan (Head)", "CT Scan (Chest)", "CT Scan (Abdomen/Pelvis)",
  "CT Scan (Spine)", "CT Angiography",
  "MRI (Brain)", "MRI (Spine)", "MRI (Knee)", "MRI (Shoulder)",
  "Ultrasound (Abdomen)", "Ultrasound (Pelvis)", "Ultrasound (Obstetric)",
  "Ultrasound (Thyroid)", "Ultrasound (Breast)", "Ultrasound (Scrotum)",
  "Echocardiogram", "Doppler Ultrasound",
  "Mammogram", "Bone Density Scan (DEXA)", "Nuclear Medicine Scan",
];

export const LAB_TESTS_LIST = [
  "Full Blood Count (FBC)", "Blood Film for Malaria", "Malaria RDT",
  "Blood Sugar (Fasting)", "Blood Sugar (Random)", "HbA1c",
  "Urea & Electrolytes", "Creatinine", "eGFR",
  "Liver Function Tests (LFTs)", "Bilirubin (Total/Direct)",
  "Lipid Profile", "Thyroid Function Tests (TFTs)",
  "HIV Test (Rapid)", "Hepatitis B Surface Antigen", "Hepatitis C Antibody",
  "VDRL/RPR (Syphilis)", "CD4 Count", "Viral Load",
  "Urinalysis", "Urine Culture & Sensitivity", "Urine Pregnancy Test",
  "Blood Culture & Sensitivity", "Sputum AFB (TB)", "GeneXpert (TB)",
  "Widal Test", "Brucella Agglutination", "CRP", "ESR", "Procalcitonin",
  "Coagulation Profile (PT/APTT/INR)", "D-Dimer",
  "Troponin I", "CK-MB", "BNP",
  "PSA (Prostate)", "CA-125 (Ovarian)", "CEA", "AFP",
  "Stool Microscopy", "Stool Culture", "H. pylori Antigen",
  "Pap Smear", "High Vaginal Swab (HVS)", "Urethral Swab",
];
