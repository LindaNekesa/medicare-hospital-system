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

export interface Referral {
  id: string;
  patientName: string;
  patientId: string;
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
