// Shared in-memory store for lab requests (persisted to localStorage)
// In production this would be a database table

export interface LabRequest {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  testType: string;
  urgency: "ROUTINE" | "URGENT" | "STAT";
  clinicalNotes: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  result?: string;
  sentAt: string;
  completedAt?: string;
}

const KEY = "medicare_lab_requests";

export function getLabRequests(): LabRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch { return []; }
}

export function saveLabRequests(requests: LabRequest[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(requests));
}

export function addLabRequest(req: Omit<LabRequest, "id" | "sentAt" | "status">): LabRequest {
  const requests = getLabRequests();
  const newReq: LabRequest = {
    ...req,
    id: `LAB-${Date.now()}`,
    status: "PENDING",
    sentAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  };
  saveLabRequests([newReq, ...requests]);
  return newReq;
}

export function updateLabRequest(id: string, updates: Partial<LabRequest>): void {
  const requests = getLabRequests();
  saveLabRequests(requests.map(r => r.id === id ? { ...r, ...updates } : r));
}
