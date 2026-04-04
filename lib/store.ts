// Persistent client-side store using localStorage
// Simulates database persistence across page refreshes

export interface Appointment {
  id: string; patientName: string; patientEmail: string;
  doctor: string; specialty: string; date: string; time: string;
  reason: string; status: string; notes?: string; createdAt: string;
}
export interface Prescription {
  id: string; patientName: string; patientEmail: string;
  drug: string; dose: string; qty: string; doctor: string;
  issued: string; status: string; notes?: string;
}
export interface Bill {
  id: string; patientName: string; patientEmail: string;
  description: string; amount: number; status: string;
  date: string; method: string; paidAt?: string;
}
export interface Notification {
  id: string; userId: string; message: string; type: string;
  read: boolean; createdAt: string;
}
export interface Message {
  id: string; from: string; to: string; subject: string;
  body: string; read: boolean; createdAt: string;
}
export interface StaffSchedule {
  id: string; staffName: string; staffEmail: string;
  date: string; shift: string; department: string; status: string;
}
export interface BedRecord {
  id: string; ward: string; bedNo: string; patientName: string;
  admittedAt: string; status: string; doctor: string;
}
export interface InsuranceMember {
  id: string; name: string; email: string; plan: string;
  premium: number; since: string; status: string; dependants: number;
}
export interface InspectionReport {
  id: string; facility: string; date: string; inspector: string;
  type: string; status: string; score?: string; findings: string; recommendations: string;
}

function get<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function set<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Appointments ──────────────────────────────────────────────────────────────
const APPT_KEY = "mc_appointments";
const APPT_SEED: Appointment[] = [
  { id:"APT-001", patientName:"John Doe", patientEmail:"john.doe@medicare.com", doctor:"Dr. Sarah Johnson", specialty:"Cardiology", date:"2026-04-05", time:"10:00", reason:"General Checkup", status:"CONFIRMED", createdAt:"2026-04-01" },
  { id:"APT-002", patientName:"Jane Smith", patientEmail:"jane.smith@medicare.com", doctor:"Dr. Peter Kamau", specialty:"General Medicine", date:"2026-04-12", time:"09:30", reason:"Diabetes Follow-up", status:"PENDING", createdAt:"2026-04-02" },
  { id:"APT-003", patientName:"Ali Hassan", patientEmail:"ali.hassan@medicare.com", doctor:"Dr. Sarah Johnson", specialty:"Cardiology", date:"2026-03-20", time:"11:00", reason:"ECG Review", status:"COMPLETED", createdAt:"2026-03-15" },
];
export const appointments = {
  getAll: () => get<Appointment>(APPT_KEY, APPT_SEED),
  getByEmail: (email: string) => get<Appointment>(APPT_KEY, APPT_SEED).filter(a => a.patientEmail === email),
  add: (a: Omit<Appointment,"id"|"createdAt">) => {
    const all = get<Appointment>(APPT_KEY, APPT_SEED);
    const n = { ...a, id:`APT-${String(all.length+1).padStart(3,"0")}`, createdAt: new Date().toISOString().slice(0,10) };
    set(APPT_KEY, [n, ...all]); return n;
  },
  update: (id: string, updates: Partial<Appointment>) => {
    const all = get<Appointment>(APPT_KEY, APPT_SEED).map(a => a.id===id ? {...a,...updates} : a);
    set(APPT_KEY, all);
  },
  delete: (id: string) => set(APPT_KEY, get<Appointment>(APPT_KEY, APPT_SEED).filter(a => a.id !== id)),
};

// ── Prescriptions ─────────────────────────────────────────────────────────────
const RX_KEY = "mc_prescriptions";
const RX_SEED: Prescription[] = [
  { id:"RX-001", patientName:"John Doe", patientEmail:"john.doe@medicare.com", drug:"Amlodipine 5mg", dose:"Once daily (morning)", qty:"30 tablets", doctor:"Dr. Sarah Johnson", issued:"2026-03-20", status:"Active" },
  { id:"RX-002", patientName:"John Doe", patientEmail:"john.doe@medicare.com", drug:"Aspirin 75mg", dose:"Once daily", qty:"30 tablets", doctor:"Dr. Sarah Johnson", issued:"2026-03-20", status:"Active" },
  { id:"RX-003", patientName:"Jane Smith", patientEmail:"jane.smith@medicare.com", drug:"Metformin 500mg", dose:"Twice daily with meals", qty:"60 tablets", doctor:"Dr. Peter Kamau", issued:"2026-02-10", status:"Active" },
];
export const prescriptions = {
  getAll: () => get<Prescription>(RX_KEY, RX_SEED),
  getByEmail: (email: string) => get<Prescription>(RX_KEY, RX_SEED).filter(p => p.patientEmail === email),
  add: (p: Omit<Prescription,"id">) => {
    const all = get<Prescription>(RX_KEY, RX_SEED);
    const n = { ...p, id:`RX-${String(all.length+1).padStart(3,"0")}` };
    set(RX_KEY, [n, ...all]); return n;
  },
  update: (id: string, updates: Partial<Prescription>) => {
    set(RX_KEY, get<Prescription>(RX_KEY, RX_SEED).map(p => p.id===id ? {...p,...updates} : p));
  },
};

// ── Bills ─────────────────────────────────────────────────────────────────────
const BILL_KEY = "mc_bills";
const BILL_SEED: Bill[] = [
  { id:"INV-001", patientName:"John Doe", patientEmail:"john.doe@medicare.com", description:"Cardiology Consultation", amount:2500, status:"PAID", date:"2026-03-20", method:"M-Pesa", paidAt:"2026-03-20" },
  { id:"INV-002", patientName:"Jane Smith", patientEmail:"jane.smith@medicare.com", description:"Lab Tests (FBC, HbA1c)", amount:4800, status:"PAID", date:"2026-02-10", method:"Cash", paidAt:"2026-02-10" },
  { id:"INV-003", patientName:"John Doe", patientEmail:"john.doe@medicare.com", description:"ECG + Consultation", amount:6200, status:"UNPAID", date:"2026-04-05", method:"" },
];
export const bills = {
  getAll: () => get<Bill>(BILL_KEY, BILL_SEED),
  getByEmail: (email: string) => get<Bill>(BILL_KEY, BILL_SEED).filter(b => b.patientEmail === email),
  add: (b: Omit<Bill,"id">) => {
    const all = get<Bill>(BILL_KEY, BILL_SEED);
    const n = { ...b, id:`INV-${String(all.length+1).padStart(3,"0")}` };
    set(BILL_KEY, [n, ...all]); return n;
  },
  markPaid: (id: string, method: string) => {
    set(BILL_KEY, get<Bill>(BILL_KEY, BILL_SEED).map(b => b.id===id ? {...b, status:"PAID", method, paidAt:new Date().toISOString().slice(0,10)} : b));
  },
};

// ── Notifications ─────────────────────────────────────────────────────────────
const NOTIF_KEY = "mc_notifications";
export const notifications = {
  getAll: () => get<Notification>(NOTIF_KEY, []),
  getByUser: (userId: string) => get<Notification>(NOTIF_KEY, []).filter(n => n.userId === userId || n.userId === "ALL"),
  add: (n: Omit<Notification,"id"|"createdAt">) => {
    const all = get<Notification>(NOTIF_KEY, []);
    const newN = { ...n, id:`N-${Date.now()}`, createdAt: new Date().toLocaleString() };
    set(NOTIF_KEY, [newN, ...all.slice(0,49)]); return newN;
  },
  markRead: (id: string) => set(NOTIF_KEY, get<Notification>(NOTIF_KEY, []).map(n => n.id===id ? {...n,read:true} : n)),
  markAllRead: (userId: string) => set(NOTIF_KEY, get<Notification>(NOTIF_KEY, []).map(n => (n.userId===userId||n.userId==="ALL") ? {...n,read:true} : n)),
};

// ── Messages ──────────────────────────────────────────────────────────────────
const MSG_KEY = "mc_messages";
export const messages = {
  getAll: () => get<Message>(MSG_KEY, []),
  getByUser: (email: string) => get<Message>(MSG_KEY, []).filter(m => m.to === email || m.from === email),
  send: (m: Omit<Message,"id"|"createdAt"|"read">) => {
    const all = get<Message>(MSG_KEY, []);
    const n = { ...m, id:`MSG-${Date.now()}`, read:false, createdAt: new Date().toLocaleString() };
    set(MSG_KEY, [n, ...all]);
    // Also create a notification for recipient
    notifications.add({ userId: m.to, message:`New message from ${m.from}: ${m.subject}`, type:"message", read:false });
    return n;
  },
  markRead: (id: string) => set(MSG_KEY, get<Message>(MSG_KEY, []).map(m => m.id===id ? {...m,read:true} : m)),
};

// ── Staff Schedule ────────────────────────────────────────────────────────────
const SCHED_KEY = "mc_schedule";
const SCHED_SEED: StaffSchedule[] = [
  { id:"S-001", staffName:"Dr. Sarah Johnson", staffEmail:"doctor@medicare.com", date:"2026-04-05", shift:"Morning (07:00–15:00)", department:"Cardiology", status:"Confirmed" },
  { id:"S-002", staffName:"Emma Wilson", staffEmail:"nurse@medicare.com", date:"2026-04-05", shift:"Morning (07:00–15:00)", department:"Ward / Nursing", status:"Confirmed" },
  { id:"S-003", staffName:"Kevin Otieno", staffEmail:"labtech@medicare.com", date:"2026-04-05", shift:"Morning (07:00–15:00)", department:"Laboratory", status:"Confirmed" },
];
export const schedule = {
  getAll: () => get<StaffSchedule>(SCHED_KEY, SCHED_SEED),
  add: (s: Omit<StaffSchedule,"id">) => {
    const all = get<StaffSchedule>(SCHED_KEY, SCHED_SEED);
    const n = { ...s, id:`S-${String(all.length+1).padStart(3,"0")}` };
    set(SCHED_KEY, [n, ...all]); return n;
  },
  update: (id: string, updates: Partial<StaffSchedule>) => set(SCHED_KEY, get<StaffSchedule>(SCHED_KEY, SCHED_SEED).map(s => s.id===id ? {...s,...updates} : s)),
  delete: (id: string) => set(SCHED_KEY, get<StaffSchedule>(SCHED_KEY, SCHED_SEED).filter(s => s.id !== id)),
};

// ── Beds ──────────────────────────────────────────────────────────────────────
const BED_KEY = "mc_beds";
const BED_SEED: BedRecord[] = [
  { id:"B-001", ward:"Cardiology", bedNo:"C-01", patientName:"Ali Hassan", admittedAt:"2026-04-01", status:"Occupied", doctor:"Dr. Sarah Johnson" },
  { id:"B-002", ward:"Cardiology", bedNo:"C-02", patientName:"", admittedAt:"", status:"Available", doctor:"" },
  { id:"B-003", ward:"General", bedNo:"G-01", patientName:"Samuel Kibet", admittedAt:"2026-03-30", status:"Occupied", doctor:"Dr. Peter Kamau" },
  { id:"B-004", ward:"General", bedNo:"G-02", patientName:"", admittedAt:"", status:"Available", doctor:"" },
  { id:"B-005", ward:"Surgery", bedNo:"S-01", patientName:"Peter Mwangi", admittedAt:"2026-04-02", status:"Post-Op", doctor:"Dr. Achieng Otieno" },
];
export const beds = {
  getAll: () => get<BedRecord>(BED_KEY, BED_SEED),
  update: (id: string, updates: Partial<BedRecord>) => set(BED_KEY, get<BedRecord>(BED_KEY, BED_SEED).map(b => b.id===id ? {...b,...updates} : b)),
};

// ── Insurance Members ─────────────────────────────────────────────────────────
const INS_KEY = "mc_insurance_members";
const INS_SEED: InsuranceMember[] = [
  { id:"MBR-001", name:"John Doe", email:"john.doe@medicare.com", plan:"Gold", premium:4500, since:"2024-01-01", status:"Active", dependants:2 },
  { id:"MBR-002", name:"Jane Smith", email:"jane.smith@medicare.com", plan:"Silver", premium:2800, since:"2023-03-01", status:"Active", dependants:1 },
  { id:"MBR-003", name:"Ali Hassan", email:"ali.hassan@medicare.com", plan:"Gold", premium:4500, since:"2022-06-01", status:"Active", dependants:3 },
];
export const insuranceMembers = {
  getAll: () => get<InsuranceMember>(INS_KEY, INS_SEED),
  add: (m: Omit<InsuranceMember,"id">) => {
    const all = get<InsuranceMember>(INS_KEY, INS_SEED);
    const n = { ...m, id:`MBR-${String(all.length+1).padStart(3,"0")}` };
    set(INS_KEY, [n, ...all]); return n;
  },
  update: (id: string, updates: Partial<InsuranceMember>) => set(INS_KEY, get<InsuranceMember>(INS_KEY, INS_SEED).map(m => m.id===id ? {...m,...updates} : m)),
};

// ── Inspection Reports ────────────────────────────────────────────────────────
const INSP_KEY = "mc_inspections";
const INSP_SEED: InspectionReport[] = [
  { id:"INS-001", facility:"Medicare Hospital", date:"2026-01-15", inspector:"MOH Inspector", type:"Routine", status:"Completed", score:"94/100", findings:"1. Infection control protocols well maintained.\n2. Staff training records up to date.\n3. Minor: one emergency exit sign not illuminated.", recommendations:"1. Replace emergency exit sign bulb within 30 days.\n2. Continue quarterly staff training." },
];
export const inspectionReports = {
  getAll: () => get<InspectionReport>(INSP_KEY, INSP_SEED),
  add: (r: Omit<InspectionReport,"id">) => {
    const all = get<InspectionReport>(INSP_KEY, INSP_SEED);
    const n = { ...r, id:`INS-${String(all.length+1).padStart(3,"0")}` };
    set(INSP_KEY, [n, ...all]); return n;
  },
};
