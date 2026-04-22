"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",   label: "Overview",           icon: "📊" },
  { id: "requests",   label: "Imaging Requests",   icon: "📥" },
  { id: "perform",    label: "Perform Study",       icon: "🩻" },
  { id: "reports",    label: "Radiology Reports",   icon: "📋" },
  { id: "patients",   label: "Patient Info",        icon: "👤" },
  { id: "equipment",  label: "Equipment",           icon: "🔧" },
  { id: "qc",         label: "Quality Control",     icon: "✅" },
  { id: "profile",    label: "My Profile",          icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b bg-indigo-700 rounded-t-2xl text-white">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-indigo-200 hover:text-white text-2xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <span>✓</span><span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

// ── Imaging Requests ──────────────────────────────────────────────────────────
function ImagingRequestsTab({ onPerform }: { onPerform: (r: ImagingRequest) => void }) {
  const [requests, setRequests] = useState<ImagingRequest[]>(IMAGING_REQUESTS);
  const [filter, setFilter] = useState("PENDING");
  const [toast, setToast] = useState("");

  const accept = (id: string) => {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: "IN_PROGRESS" } : x));
    setToast("Request accepted — marked as In Progress");
    setTimeout(() => setToast(""), 3000);
  };
  const reject = (id: string) => {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: "REJECTED" } : x));
    setToast("Request rejected");
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = requests.filter(r => filter === "ALL" ? true : r.status === filter);
  const URGENCY_COLORS: Record<string, string> = { ROUTINE: "bg-green-100 text-green-700", URGENT: "bg-orange-100 text-orange-700", STAT: "bg-red-100 text-red-700" };
  const STATUS_COLORS: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-700", IN_PROGRESS: "bg-blue-100 text-blue-700", COMPLETED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-4">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Incoming Imaging Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Requests from doctors — accept to begin study</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Pending", requests.filter(r => r.status === "PENDING").length, "bg-yellow-50 border-yellow-100 text-yellow-700"],
          ["In Progress", requests.filter(r => r.status === "IN_PROGRESS").length, "bg-blue-50 border-blue-100 text-blue-700"],
          ["Completed", requests.filter(r => r.status === "COMPLETED").length, "bg-green-50 border-green-100 text-green-700"],
          ["Total", requests.length, "bg-gray-50 border-gray-100 text-gray-700"]].map(([l, v, c]) => (
          <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}>
            <p className="text-2xl font-bold">{v as number}</p>
            <p className="text-xs font-medium mt-0.5">{l as string}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap">
        {["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED", "ALL"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border text-gray-400">
          <div className="text-4xl mb-3">📥</div>
          <p>No {filter.toLowerCase().replace("_", " ")} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${r.urgency === "STAT" ? "border-red-500" : r.urgency === "URGENT" ? "border-orange-500" : "border-indigo-400"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge label={r.urgency} color={URGENCY_COLORS[r.urgency]} />
                    <Badge label={r.status.replace("_", " ")} color={STATUS_COLORS[r.status]} />
                    <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{r.patientName}</p>
                  <p className="text-sm font-medium text-indigo-700">{r.studyType}</p>
                  <p className="text-xs text-gray-500 mt-1"><span className="font-medium">From:</span> {r.requestedBy}</p>
                  <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Body Part:</span> {r.bodyPart}</p>
                  {r.clinicalInfo && <p className="text-xs text-gray-500 italic mt-0.5">Clinical: {r.clinicalInfo}</p>}
                  <p className="text-xs text-gray-400 mt-1">Received: {r.receivedAt}</p>
                  {r.report && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-xs font-semibold text-green-700 mb-0.5">Report sent ✓</p>
                      <p className="text-xs text-gray-700 line-clamp-2">{r.report}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {r.status === "PENDING" && (
                    <>
                      <button onClick={() => accept(r.id)} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 font-medium">Accept</button>
                      <button onClick={() => reject(r.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Reject</button>
                    </>
                  )}
                  {r.status === "IN_PROGRESS" && (
                    <button onClick={() => onPerform(r)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">Write Report</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Perform Study / Write Report ──────────────────────────────────────────────
function PerformStudyTab({ preselected, onDone, requests, setRequests }: {
  preselected: ImagingRequest | null;
  onDone: () => void;
  requests: ImagingRequest[];
  setRequests: React.Dispatch<React.SetStateAction<ImagingRequest[]>>;
}) {
  const [selectedId, setSelectedId] = useState(preselected?.id || "");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    technique: "", findings: "", impression: "", recommendation: "", radiographerName: "Grace Adhiambo",
  });

  const inProgress = requests.filter(r => r.status === "IN_PROGRESS");
  const selected = requests.find(r => r.id === selectedId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !form.findings || !form.impression) return;
    const report = [
      `RADIOLOGY REPORT`,
      `${"─".repeat(40)}`,
      `Patient: ${selected?.patientName}`,
      `Study: ${selected?.studyType}`,
      `Body Part: ${selected?.bodyPart}`,
      `Requested by: ${selected?.requestedBy}`,
      ``,
      `TECHNIQUE`,
      form.technique || "Standard protocol",
      ``,
      `FINDINGS`,
      form.findings,
      ``,
      `IMPRESSION`,
      form.impression,
      form.recommendation ? `\nRECOMMENDATION\n${form.recommendation}` : "",
      ``,
      `${"─".repeat(40)}`,
      `Radiographer: ${form.radiographerName}`,
      `Date: ${new Date().toLocaleString()}`,
    ].filter(l => l !== "").join("\n");

    setRequests(r => r.map(x => x.id === selectedId ? { ...x, status: "COMPLETED", report, completedAt: new Date().toLocaleString() } : x));
    setToast(`Report sent to ${selected?.requestedBy} for ${selected?.patientName}`);
    setForm({ technique: "", findings: "", impression: "", recommendation: "", radiographerName: "Grace Adhiambo" });
    setSelectedId("");
    setTimeout(() => { onDone(); }, 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <h2 className="text-lg font-bold text-gray-900">Write Radiology Report</h2>
      <p className="text-sm text-gray-500">Report is automatically sent to the requesting doctor.</p>

      <form onSubmit={submit} className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-indigo-700 text-white px-5 py-3">
          <h3 className="font-semibold">Radiology Report Form</h3>
          <p className="text-indigo-200 text-xs mt-0.5">Complete all sections carefully before submitting</p>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Step 1 — Select Study</p>
            <select required className={inputCls} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              <option value="">— Select an accepted imaging request —</option>
              {inProgress.map(r => (
                <option key={r.id} value={r.id}>[{r.urgency}] {r.patientName} — {r.studyType} ({r.bodyPart})</option>
              ))}
            </select>
            {selected && (
              <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Badge label={selected.urgency} color={selected.urgency === "STAT" ? "bg-red-100 text-red-700" : selected.urgency === "URGENT" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"} />
                  <span className="font-semibold text-gray-900">{selected.patientName}</span>
                </div>
                <p><span className="text-gray-500">Study:</span> <strong>{selected.studyType}</strong></p>
                <p><span className="text-gray-500">Body Part:</span> {selected.bodyPart}</p>
                <p><span className="text-gray-500">Requested by:</span> {selected.requestedBy}</p>
                {selected.clinicalInfo && <p className="text-gray-500 italic">{selected.clinicalInfo}</p>}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Step 2 — Technique</p>
            <Field label="Imaging Technique Used">
              <input className={inputCls} value={form.technique} onChange={e => setForm(f => ({ ...f, technique: e.target.value }))} placeholder="e.g. PA and lateral chest X-ray, standard protocol" />
            </Field>
          </div>

          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Step 3 — Findings *</p>
            <Field label="Radiological Findings">
              <textarea required className={`${inputCls} font-mono`} rows={6} value={form.findings}
                onChange={e => setForm(f => ({ ...f, findings: e.target.value }))}
                placeholder={`Describe all findings systematically.\n\nExample:\n• Heart size: Normal\n• Lung fields: Clear, no consolidation\n• Costophrenic angles: Sharp bilaterally\n• Bony structures: Intact`} />
            </Field>
          </div>

          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Step 4 — Impression *</p>
            <Field label="Radiological Impression / Conclusion">
              <textarea required className={inputCls} rows={3} value={form.impression}
                onChange={e => setForm(f => ({ ...f, impression: e.target.value }))}
                placeholder="e.g. Normal chest X-ray. No acute cardiopulmonary pathology identified." />
            </Field>
          </div>

          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Step 5 — Recommendation</p>
            <Field label="Further Recommendations (optional)">
              <textarea className={inputCls} rows={2} value={form.recommendation}
                onChange={e => setForm(f => ({ ...f, recommendation: e.target.value }))}
                placeholder="e.g. Correlate with clinical findings. Consider CT if symptoms persist." />
            </Field>
          </div>

          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Step 6 — Authorisation</p>
            <Field label="Radiographer Name / Signature">
              <input className={inputCls} value={form.radiographerName} onChange={e => setForm(f => ({ ...f, radiographerName: e.target.value }))} />
            </Field>
          </div>

          <div className="flex gap-3 pt-3 border-t">
            <button type="button" onClick={() => { setSelectedId(""); setForm({ technique: "", findings: "", impression: "", recommendation: "", radiographerName: "Grace Adhiambo" }); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Clear</button>
            <button type="submit" disabled={!selectedId || !form.findings || !form.impression}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              ✓ Submit Report to Doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Radiology Reports History ─────────────────────────────────────────────────
function ReportsHistoryTab({ requests }: { requests: ImagingRequest[] }) {
  const [search, setSearch] = useState("");
  const completed = requests.filter(r => r.status === "COMPLETED" || r.status === "REJECTED");
  const filtered = completed.filter(r => `${r.patientName} ${r.studyType} ${r.requestedBy}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Radiology Reports</h2>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient, study or doctor..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p>No completed studies yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge label={r.status} color={r.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} />
                    <Badge label={r.urgency} color={r.urgency === "STAT" ? "bg-red-100 text-red-700" : r.urgency === "URGENT" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"} />
                    <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{r.patientName}</p>
                  <p className="text-sm text-indigo-700 font-medium">{r.studyType} — {r.bodyPart}</p>
                  <p className="text-xs text-gray-500 mt-1">Doctor: {r.requestedBy} · Received: {r.receivedAt}</p>
                  {r.completedAt && <p className="text-xs text-gray-400">Completed: {r.completedAt}</p>}
                  {r.report && (
                    <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Report sent to doctor:</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-4">{r.report}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Patient Info (read-only) ───────────────────────────────────────────────────
function PatientInfoTab() {
  const [search, setSearch] = useState("");
  const filtered = PATIENTS.filter(p => `${p.name} ${p.condition}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Patient Information</h2>
        <p className="text-sm text-gray-500 mt-0.5">Read-only access — for clinical context during imaging</p>
      </div>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 font-medium">
        ⚠ You have read-only access to patient information. You cannot modify patient records.
      </div>
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold shrink-0">{p.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">{p.sex} · {p.age} yrs · Blood: {p.blood}</p>
              </div>
              <Badge label={p.status} color={p.status === "Active" ? "bg-green-100 text-green-700" : p.status === "Critical" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"} />
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-gray-500">
              <span className="font-medium">Condition:</span> {p.condition} · <span className="font-medium">Phone:</span> {p.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Equipment Tab ─────────────────────────────────────────────────────────────
function EquipmentTab() {
  const [equipment, setEquipment] = useState([
    { id: "EQ-001", name: "X-Ray Machine (Siemens Ysio Max)", status: "Operational", lastService: "Mar 10, 2026", nextService: "Jun 10, 2026", notes: "Calibrated weekly" },
    { id: "EQ-002", name: "CT Scanner (GE Revolution 256)", status: "Operational", lastService: "Feb 28, 2026", nextService: "May 28, 2026", notes: "Daily QC run" },
    { id: "EQ-003", name: "Ultrasound (Philips EPIQ Elite)", status: "Operational", lastService: "Mar 20, 2026", nextService: "Jun 20, 2026", notes: "Probes cleaned daily" },
    { id: "EQ-004", name: "MRI (Siemens MAGNETOM Vida)", status: "Needs Service", lastService: "Jan 15, 2026", nextService: "Apr 15, 2026", notes: "Gradient coil issue reported" },
    { id: "EQ-005", name: "PACS Workstation", status: "Operational", lastService: "Apr 1, 2026", nextService: "Oct 1, 2026", notes: "Software updated" },
  ]);

  const STATUS_CLS: Record<string, string> = { Operational: "bg-green-100 text-green-700", "Needs Service": "bg-red-100 text-red-700", "Under Maintenance": "bg-yellow-100 text-yellow-700" };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Radiology Equipment</h2>
      <div className="grid grid-cols-3 gap-3">
        {[["Operational", equipment.filter(e => e.status === "Operational").length, "bg-green-50 border-green-100 text-green-700"],
          ["Needs Service", equipment.filter(e => e.status === "Needs Service").length, "bg-red-50 border-red-100 text-red-700"],
          ["Total", equipment.length, "bg-gray-50 border-gray-100 text-gray-700"]].map(([l, v, c]) => (
          <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}>
            <p className="text-2xl font-bold">{v as number}</p>
            <p className="text-xs font-medium mt-0.5">{l as string}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {equipment.map(eq => (
          <div key={eq.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${eq.status === "Operational" ? "border-green-500" : "border-red-500"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge label={eq.status} color={STATUS_CLS[eq.status] || "bg-gray-100 text-gray-700"} />
                  <span className="text-xs text-gray-400 font-mono">{eq.id}</span>
                </div>
                <p className="font-semibold text-gray-900">{eq.name}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>Last service: <strong className="text-gray-700">{eq.lastService}</strong></span>
                  <span>Next due: <strong className={new Date(eq.nextService) < new Date() ? "text-red-600" : "text-gray-700"}>{eq.nextService}</strong></span>
                </div>
                {eq.notes && <p className="text-xs text-gray-400 mt-1 italic">{eq.notes}</p>}
              </div>
              <button onClick={() => setEquipment(prev => prev.map(e => e.id === eq.id ? { ...e, status: e.status === "Operational" ? "Needs Service" : "Operational" } : e))}
                className="text-xs text-indigo-600 hover:underline shrink-0">Toggle Status</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quality Control ───────────────────────────────────────────────────────────
function QualityControlTab() {
  const [qcLogs, setQcLogs] = useState([
    { id: "QC-001", equipment: "X-Ray Machine", test: "Exposure Calibration", result: "Pass", date: "Apr 8, 2026 07:00", tech: "Grace Adhiambo", notes: "kVp and mAs within tolerance" },
    { id: "QC-002", equipment: "CT Scanner", test: "Image Quality Phantom", result: "Pass", date: "Apr 8, 2026 07:30", tech: "Grace Adhiambo", notes: "Spatial resolution acceptable" },
    { id: "QC-003", equipment: "Ultrasound", test: "Probe Sensitivity Check", result: "Pass", date: "Apr 8, 2026 08:00", tech: "Grace Adhiambo", notes: "All probes within spec" },
    { id: "QC-004", equipment: "MRI", test: "SNR Measurement", result: "Fail", date: "Apr 7, 2026 07:00", tech: "Grace Adhiambo", notes: "SNR below threshold — service requested" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ equipment: "", test: "", result: "Pass", notes: "" });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `QC-${String(qcLogs.length + 1).padStart(3, "0")}`;
    setQcLogs(q => [{ id, ...form, date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }), tech: "Grace Adhiambo" }, ...q]);
    setForm({ equipment: "", test: "", result: "Pass", notes: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <Modal title="Log QC Check" onClose={() => setShowForm(false)}>
          <form onSubmit={add} className="space-y-4">
            <Field label="Equipment"><input required className={inputCls} value={form.equipment} onChange={e => setForm(f => ({ ...f, equipment: e.target.value }))} placeholder="e.g. X-Ray Machine" /></Field>
            <Field label="QC Test"><input required className={inputCls} value={form.test} onChange={e => setForm(f => ({ ...f, test: e.target.value }))} placeholder="e.g. Exposure Calibration" /></Field>
            <Field label="Result">
              <div className="flex gap-2">
                {["Pass", "Fail", "Repeat"].map(r => (
                  <button key={r} type="button" onClick={() => setForm(f => ({ ...f, result: r }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.result === r ? (r === "Pass" ? "bg-green-600 text-white border-green-600" : r === "Fail" ? "bg-red-600 text-white border-red-600" : "bg-yellow-500 text-white border-yellow-500") : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></Field>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Log QC</button>
            </div>
          </form>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Quality Control Log</h2>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">+ Log QC Check</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[["Pass", qcLogs.filter(q => q.result === "Pass").length, "bg-green-50 border-green-100 text-green-700"],
          ["Fail", qcLogs.filter(q => q.result === "Fail").length, "bg-red-50 border-red-100 text-red-700"],
          ["Total", qcLogs.length, "bg-gray-50 border-gray-100 text-gray-700"]].map(([l, v, c]) => (
          <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}>
            <p className="text-2xl font-bold">{v as number}</p>
            <p className="text-xs font-medium mt-0.5">{l as string}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {qcLogs.map(q => (
          <div key={q.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${q.result === "Pass" ? "border-green-500" : q.result === "Fail" ? "border-red-500" : "border-yellow-500"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge label={q.result} color={q.result === "Pass" ? "bg-green-100 text-green-700" : q.result === "Fail" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"} />
                  <span className="text-xs text-gray-400 font-mono">{q.id}</span>
                </div>
                <p className="font-semibold text-gray-900">{q.equipment}</p>
                <p className="text-sm text-gray-600">{q.test}</p>
                <p className="text-xs text-gray-400 mt-1">{q.date} · {q.tech}</p>
                {q.notes && <p className="text-xs text-gray-500 mt-0.5 italic">{q.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Types & Data ──────────────────────────────────────────────────────────────
interface ImagingRequest {
  id: string; patientName: string; studyType: string; bodyPart: string;
  urgency: "ROUTINE" | "URGENT" | "STAT"; requestedBy: string;
  clinicalInfo: string; status: string; receivedAt: string;
  report?: string; completedAt?: string;
}

const PATIENTS = [
  { id: "P-001", name: "John Doe",     age: 39, sex: "M", blood: "O+",  condition: "Hypertension",       status: "Active",   phone: "0733333333" },
  { id: "P-002", name: "Jane Smith",   age: 34, sex: "F", blood: "A+",  condition: "Diabetes Type 2",    status: "Active",   phone: "0744444444" },
  { id: "P-003", name: "Ali Hassan",   age: 47, sex: "M", blood: "B+",  condition: "Cardiac Arrhythmia", status: "Admitted", phone: "0755000001" },
  { id: "P-004", name: "Mary Wanjiku", age: 25, sex: "F", blood: "AB+", condition: "Prenatal Care",      status: "Active",   phone: "0755000002" },
  { id: "P-005", name: "Samuel Kibet", age: 55, sex: "M", blood: "B-",  condition: "Renal Failure",      status: "Critical", phone: "0777000001" },
];

const IMAGING_REQUESTS: ImagingRequest[] = [
  { id: "IMG-001", patientName: "John Doe",     studyType: "Chest X-Ray",        bodyPart: "Chest",       urgency: "ROUTINE", requestedBy: "Dr. Sarah Johnson", clinicalInfo: "Persistent cough, rule out pneumonia", status: "PENDING",     receivedAt: "Apr 8, 2026 08:00" },
  { id: "IMG-002", patientName: "Ali Hassan",   studyType: "CT Chest",           bodyPart: "Chest",       urgency: "URGENT",  requestedBy: "Dr. Sarah Johnson", clinicalInfo: "Suspected pulmonary embolism", status: "IN_PROGRESS", receivedAt: "Apr 8, 2026 09:00" },
  { id: "IMG-003", patientName: "Mary Wanjiku", studyType: "Obstetric Ultrasound",bodyPart: "Abdomen",    urgency: "ROUTINE", requestedBy: "Dr. Achieng Otieno", clinicalInfo: "38 weeks gestation, fetal wellbeing", status: "PENDING",     receivedAt: "Apr 8, 2026 09:30" },
  { id: "IMG-004", patientName: "Samuel Kibet", studyType: "Abdominal Ultrasound",bodyPart: "Abdomen",    urgency: "URGENT",  requestedBy: "Dr. Peter Kamau",   clinicalInfo: "Renal failure, assess kidney size", status: "COMPLETED",   receivedAt: "Apr 7, 2026 14:00", completedAt: "Apr 7, 2026 15:30", report: "RADIOLOGY REPORT\n────────────────────────────────────────\nPatient: Samuel Kibet\nStudy: Abdominal Ultrasound\n\nFINDINGS\nBilateral kidneys reduced in size. Right kidney: 7.2cm. Left kidney: 7.0cm. Increased echogenicity bilaterally consistent with chronic renal parenchymal disease.\n\nIMPRESSION\nBilateral small echogenic kidneys consistent with chronic kidney disease.\n\nRadiographer: Grace Adhiambo" },
];

// ── Main Radiographer Dashboard ───────────────────────────────────────────────
export default function RadiographerDashboard() {
  const [tab, setTab] = useState("overview");
  const [performTarget, setPerformTarget] = useState<ImagingRequest | null>(null);
  const [requests, setRequests] = useState<ImagingRequest[]>(IMAGING_REQUESTS);

  const handlePerform = (r: ImagingRequest) => { setPerformTarget(r); setTab("perform"); };

  const pending = requests.filter(r => r.status === "PENDING").length;
  const inProgress = requests.filter(r => r.status === "IN_PROGRESS").length;
  const completed = requests.filter(r => r.status === "COMPLETED").length;

  return (
    <DashboardShell title="Radiology Portal" role="Radiographer" accentColor="bg-indigo-700" icon="🩻" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Radiology Overview</h2>
            <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Pending Requests", pending, "bg-yellow-600", "📥"],
              ["In Progress", inProgress, "bg-blue-600", "🩻"],
              ["Reports Sent", completed, "bg-green-600", "✅"],
              ["Total Today", requests.length, "bg-indigo-700", "📋"]].map(([label, value, color, icon]) => (
              <div key={label as string} className={`${color} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-3xl font-bold">{value}</span>
                </div>
                <p className="text-sm font-medium opacity-90">{label as string}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Imaging Requests", "requests", "📥", "bg-yellow-50 border-yellow-100 text-yellow-700"],
              ["Write Report", "perform", "🩻", "bg-indigo-50 border-indigo-100 text-indigo-700"],
              ["Equipment", "equipment", "🔧", "bg-blue-50 border-blue-100 text-blue-700"],
              ["Quality Control", "qc", "✅", "bg-green-50 border-green-100 text-green-700"]].map(([label, id, icon, cls]) => (
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Radiographer Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[["📥 Receive Imaging Requests", "Accept or reject requests from doctors"],
                ["🩻 Perform Imaging Studies", "X-Ray, CT, MRI, Ultrasound, Fluoroscopy"],
                ["📋 Write Radiology Reports", "Document findings and send to requesting doctor"],
                ["✅ Quality Control", "Daily QC checks on all imaging equipment"],
                ["🔧 Equipment Maintenance", "Log maintenance and calibration records"],
                ["👤 Patient Positioning", "Ensure correct patient positioning for studies"],
                ["☢ Radiation Safety", "Apply ALARA principles, monitor dose"],
                ["📁 PACS Management", "Archive and manage imaging records"]].map(([title, desc]) => (
                <div key={title as string} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg shrink-0">{(title as string).split(" ")[0]}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{(title as string).slice(3)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "requests" && <ImagingRequestsTab onPerform={handlePerform} />}
      {tab === "perform" && <PerformStudyTab preselected={performTarget} onDone={() => { setPerformTarget(null); setTab("reports"); }} requests={requests} setRequests={setRequests} />}
      {tab === "reports" && <ReportsHistoryTab requests={requests} />}
      {tab === "patients" && <PatientInfoTab />}
      {tab === "equipment" && <EquipmentTab />}
      {tab === "qc" && <QualityControlTab />}
      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
