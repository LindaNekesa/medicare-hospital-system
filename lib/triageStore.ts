// Shared triage store — persisted to localStorage
// Nurse adds patients → Doctor sees them auto-updated (polls every 3s)

export interface TriagePatient {
  id: string;
  name: string;
  age: number;
  sex: string;
  complaint: string;
  bp: string;
  pulse: number;
  temp: number;
  spo2: number;
  priority: "CRITICAL" | "URGENT" | "ROUTINE";
  time: string;
  status: "Waiting" | "Called" | "With Doctor" | "Seen" | "Discharged";
  triageBy: string;       // nurse name
  assignedDoctor?: string;
  ward?: string;
  createdAt: string;
}

const KEY = "medicare_triage_queue";

const SEED: TriagePatient[] = [
  { id:"T-001", name:"John Doe",     age:39, sex:"M", complaint:"Chest pain, shortness of breath", bp:"145/95", pulse:98,  temp:37.2, spo2:94, priority:"CRITICAL", time:"08:45", status:"Waiting", triageBy:"Emma Wilson",  createdAt: new Date().toISOString() },
  { id:"T-002", name:"Grace Otieno", age:18, sex:"F", complaint:"Asthma attack, wheezing",         bp:"110/70", pulse:112, temp:37.8, spo2:91, priority:"URGENT",   time:"09:10", status:"Waiting", triageBy:"Emma Wilson",  createdAt: new Date().toISOString() },
  { id:"T-003", name:"Peter Mwangi", age:62, sex:"M", complaint:"Post-op wound check",             bp:"130/80", pulse:76,  temp:36.8, spo2:98, priority:"ROUTINE",  time:"09:30", status:"Waiting", triageBy:"Emma Wilson",  createdAt: new Date().toISOString() },
  { id:"T-004", name:"Fatuma Abdi",  age:29, sex:"F", complaint:"Labour pains, 38 weeks",          bp:"120/75", pulse:88,  temp:37.0, spo2:99, priority:"URGENT",   time:"09:45", status:"Waiting", triageBy:"Emma Wilson",  createdAt: new Date().toISOString() },
];

export function getTriageQueue(): TriagePatient[] {
  if (typeof window === "undefined") return SEED;
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(stored);
  } catch { return SEED; }
}

export function saveTriageQueue(queue: TriagePatient[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(queue));
}

export function addTriagePatient(patient: Omit<TriagePatient, "id" | "createdAt">): TriagePatient {
  const queue = getTriageQueue();
  const newP: TriagePatient = {
    ...patient,
    id: `T-${String(queue.length + 1).padStart(3, "0")}-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  saveTriageQueue([newP, ...queue]);
  return newP;
}

export function updateTriagePatient(id: string, updates: Partial<TriagePatient>): void {
  const queue = getTriageQueue();
  saveTriageQueue(queue.map(p => p.id === id ? { ...p, ...updates } : p));
}
