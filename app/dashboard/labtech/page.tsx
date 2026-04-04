"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";
import { getLabRequests, updateLabRequest, LabRequest } from "@/lib/labStore";

const NAV = [
  { id: "overview",  label: "Overview",          icon: "📊" },
  { id: "requests",  label: "Incoming Requests",  icon: "📥" },
  { id: "process",   label: "Process & Results",  icon: "🧪" },
  { id: "history",   label: "Completed Tests",    icon: "📋" },
  { id: "specimens", label: "Specimen Log",        icon: "🧫" },
  { id: "qc",        label: "Quality Control",     icon: "✅" },
  { id: "equipment", label: "Equipment",           icon: "🔧" },
  { id: "profile",   label: "My Profile",          icon: "👤" },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <span>✓</span><span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500";
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

const URGENCY_COLORS: Record<string, string> = {
  ROUTINE: "bg-green-100 text-green-700",
  URGENT:  "bg-orange-100 text-orange-700",
  STAT:    "bg-red-100 text-red-700",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING:     "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED:   "bg-green-100 text-green-700",
  REJECTED:    "bg-red-100 text-red-700",
};

// ── Incoming Requests Tab ─────────────────────────────────────────────────────
function IncomingRequestsTab({ onProcess }: { onProcess: (r: LabRequest) => void }) {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [filter, setFilter] = useState("PENDING");
  const [toast, setToast] = useState("");
  const prevCount = useRef(0);

  // Poll every 3s — alert when new requests arrive
  useEffect(() => {
    const poll = () => {
      const all = getLabRequests();
      setRequests(all);
      const pending = all.filter(r => r.status === "PENDING").length;
      if (pending > prevCount.current && prevCount.current > 0) {
        setToast(`New lab request received!`);
      }
      prevCount.current = pending;
    };
    poll();
    const t = setInterval(poll, 3000);
    return () => clearInterval(t);
  }, []);

  const accept = (id: string) => {
    updateLabRequest(id, { status: "IN_PROGRESS" });
    setRequests(getLabRequests());
    setToast("Request accepted — marked as In Progress");
  };
  const reject = (id: string, reason: string) => {
    updateLabRequest(id, { status: "REJECTED", result: `Rejected: ${reason}` });
    setRequests(getLabRequests());
    setToast("Request rejected");
  };

  const filtered = requests.filter(r => filter === "ALL" ? true : r.status === filter);
  const pending = requests.filter(r => r.status === "PENDING").length;
  const inProgress = requests.filter(r => r.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-4">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Incoming Lab Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">From doctors — auto-refreshes every 3 seconds</p>
        </div>
        <button onClick={() => setRequests(getLabRequests())} className="text-sm text-yellow-700 font-medium hover:underline">↻ Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Pending",     pending,                                                    "bg-yellow-50 border-yellow-100 text-yellow-700"],
          ["In Progress", inProgress,                                                 "bg-blue-50 border-blue-100 text-blue-700"],
          ["Completed",   requests.filter(r=>r.status==="COMPLETED").length,          "bg-green-50 border-green-100 text-green-700"],
          ["Total",       requests.length,                                            "bg-gray-50 border-gray-100 text-gray-700"],
        ].map(([l,v,c]) => (
          <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}>
            <p className="text-2xl font-bold">{v as number}</p>
            <p className="text-xs font-medium mt-0.5">{l as string}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 flex-wrap">
        {["PENDING","IN_PROGRESS","COMPLETED","REJECTED","ALL"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter===s?"bg-yellow-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s.replace("_"," ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="text-4xl mb-3">📥</div>
          <p className="text-gray-500">No {filter.toLowerCase().replace("_"," ")} requests</p>
          <p className="text-xs text-gray-400 mt-1">Requests from doctors will appear here automatically</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${r.urgency==="STAT"?"border-red-500":r.urgency==="URGENT"?"border-orange-500":"border-blue-400"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge label={r.urgency} color={URGENCY_COLORS[r.urgency]} />
                    <Badge label={r.status.replace("_"," ")} color={STATUS_COLORS[r.status]} />
                    <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{r.patientName}</p>
                  <p className="text-sm font-medium text-yellow-700">{r.testType}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">From:</span> {r.doctorName}
                  </p>
                  {r.clinicalNotes && (
                    <p className="text-xs text-gray-500 mt-0.5 italic">Note: {r.clinicalNotes}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Received: {r.sentAt}</p>
                  {r.result && r.status === "COMPLETED" && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-xs font-semibold text-green-700 mb-0.5">Result sent to doctor ✓</p>
                      <p className="text-xs text-gray-700">{r.result}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {r.status === "PENDING" && (
                    <>
                      <button onClick={() => accept(r.id)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
                        Accept
                      </button>
                      <button onClick={() => reject(r.id, "Insufficient sample")}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium whitespace-nowrap">
                        Reject
                      </button>
                    </>
                  )}
                  {r.status === "IN_PROGRESS" && (
                    <button onClick={() => onProcess(r)}
                      className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium whitespace-nowrap">
                      Enter Result
                    </button>
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

// ── Process & Results Tab ─────────────────────────────────────────────────────
function ProcessResultsTab({ preselected, onDone }: { preselected: LabRequest | null; onDone: () => void }) {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [allRequests, setAllRequests] = useState<LabRequest[]>([]);
  const [selectedId, setSelectedId] = useState(preselected?.id || "");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    specimenType: "",
    collectedAt: new Date().toISOString().slice(0, 16),
    result: "",
    unit: "",
    referenceRange: "",
    interpretation: "",
    remarks: "",
    verifiedBy: "Lab Tech",
    techSignature: "",
  });

  const refresh = () => {
    const all = getLabRequests();
    setAllRequests(all);
    setRequests(all.filter(r => r.status === "IN_PROGRESS"));
  };

  useEffect(() => {
    refresh();
    if (preselected) setSelectedId(preselected.id);
  }, [preselected]);

  const selected = requests.find(r => r.id === selectedId);

  const SPECIMEN_TYPES = ["Whole Blood (EDTA)", "Serum", "Plasma", "Urine (Midstream)", "Stool", "Sputum", "Swab", "CSF", "Tissue Biopsy", "Saliva"];
  const INTERPRETATIONS = ["Normal", "Abnormal — Low", "Abnormal — High", "Critical Low", "Critical High", "Inconclusive", "Reactive", "Non-Reactive"];

  const isCritical = ["Critical Low","Critical High"].includes(form.interpretation);

  const buildFullResult = () => [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `LABORATORY RESULT REPORT`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Patient:        ${selected?.patientName || "—"}`,
    `Test:           ${selected?.testType || "—"}`,
    `Requested by:   ${selected?.doctorName || "—"}`,
    `Request ID:     ${selected?.id || "—"}`,
    ``,
    `SPECIMEN DETAILS`,
    `Type:           ${form.specimenType || "N/A"}`,
    `Collected:      ${form.collectedAt ? new Date(form.collectedAt).toLocaleString() : "N/A"}`,
    ``,
    `RESULT`,
    `Value:          ${form.result}${form.unit ? " " + form.unit : ""}`,
    form.referenceRange ? `Reference:      ${form.referenceRange}` : "",
    form.interpretation ? `Interpretation: ${form.interpretation}` : "",
    isCritical ? `⚠ CRITICAL VALUE — Immediate notification required` : "",
    ``,
    form.remarks ? `REMARKS\n${form.remarks}` : "",
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Verified by:    ${form.verifiedBy}`,
    form.techSignature ? `Signature:      ${form.techSignature}` : "",
    `Date:           ${new Date().toLocaleString()}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].filter(l => l !== "").join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !form.result) return;
    setSubmitting(true);
    updateLabRequest(selectedId, {
      status: "COMPLETED",
      result: buildFullResult(),
      completedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    });
    setToast(`✓ Result sent to ${selected?.doctorName} for ${selected?.patientName}`);
    setForm({ specimenType:"", collectedAt:new Date().toISOString().slice(0,16), result:"", unit:"", referenceRange:"", interpretation:"", remarks:"", verifiedBy:"Lab Tech", techSignature:"" });
    setSelectedId("");
    setSubmitting(false);
    setPreview(false);
    setTimeout(() => { onDone(); }, 2000);
  };

  const completedCount = allRequests.filter(r => r.status === "COMPLETED").length;
  const pendingCount = requests.length;

  return (
    <div className="space-y-4">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}

      {/* Preview modal */}
      {preview && selected && (
        <Modal title="Result Preview" onClose={() => setPreview(false)}>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs whitespace-pre-wrap overflow-x-auto">
            {buildFullResult()}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setPreview(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Edit</button>
            <button onClick={submit as unknown as React.MouseEventHandler} className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">
              Confirm & Send to Doctor
            </button>
          </div>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Write & Submit Lab Results</h2>
          <p className="text-sm text-gray-500 mt-0.5">Results are automatically sent to the requesting doctor</p>
        </div>
        <button onClick={refresh} className="text-sm text-yellow-700 font-medium hover:underline">↻ Refresh</button>
      </div>

      {/* Status bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{pendingCount}</p>
          <p className="text-xs text-blue-600 font-medium">Awaiting Results</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
          <p className="text-xs text-green-600 font-medium">Results Sent Today</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center text-gray-400">
          <div className="text-4xl mb-3">🧪</div>
          <p className="font-medium text-gray-600">No tests in progress</p>
          <p className="text-sm mt-1">Accept a request from the Incoming Requests tab first</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setPreview(true); }} className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-700 text-white px-5 py-3">
            <h3 className="font-semibold">Laboratory Result Form</h3>
            <p className="text-yellow-200 text-xs mt-0.5">Fill all fields carefully — results will be sent directly to the doctor</p>
          </div>

          <div className="p-5 space-y-5">
            {/* Step 1 — Select test */}
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">Step 1 — Select Test Request</p>
              <select required className={inputCls} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">— Select an in-progress test —</option>
                {requests.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.urgency}] {r.patientName} — {r.testType}
                  </option>
                ))}
              </select>
              {selected && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={selected.urgency} color={URGENCY_COLORS[selected.urgency]} />
                    <span className="font-semibold text-gray-900">{selected.patientName}</span>
                  </div>
                  <p className="text-gray-600"><span className="font-medium">Test:</span> {selected.testType}</p>
                  <p className="text-gray-600"><span className="font-medium">Doctor:</span> {selected.doctorName}</p>
                  {selected.clinicalNotes && <p className="text-gray-500 italic mt-1">Clinical note: {selected.clinicalNotes}</p>}
                </div>
              )}
            </div>

            {/* Step 2 — Specimen */}
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">Step 2 — Specimen Details</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Specimen Type">
                  <select className={inputCls} value={form.specimenType} onChange={e => setForm(f => ({ ...f, specimenType: e.target.value }))}>
                    <option value="">Select specimen</option>
                    {SPECIMEN_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Collection Date & Time">
                  <input type="datetime-local" className={inputCls} value={form.collectedAt} onChange={e => setForm(f => ({ ...f, collectedAt: e.target.value }))} />
                </Field>
              </div>
            </div>

            {/* Step 3 — Result */}
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">Step 3 — Test Result</p>
              <Field label="Result / Findings *">
                <textarea required className={`${inputCls} font-mono`} rows={5} value={form.result}
                  onChange={e => setForm(f => ({ ...f, result: e.target.value }))}
                  placeholder={`Enter the result value(s) here.\n\nExamples:\n• Haemoglobin: 11.2 g/dL\n• WBC: 8.4 × 10⁹/L\n• Platelets: 220 × 10⁹/L\n• Malaria: Negative`} />
              </Field>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Unit">
                  <input className={inputCls} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. g/dL, mmol/L, IU/L" />
                </Field>
                <Field label="Reference Range">
                  <input className={inputCls} value={form.referenceRange} onChange={e => setForm(f => ({ ...f, referenceRange: e.target.value }))} placeholder="e.g. 12–16 g/dL" />
                </Field>
              </div>
            </div>

            {/* Step 4 — Interpretation */}
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">Step 4 — Interpretation & Remarks</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Interpretation">
                  <select className={`${inputCls} ${isCritical ? "border-red-500 bg-red-50" : ""}`} value={form.interpretation} onChange={e => setForm(f => ({ ...f, interpretation: e.target.value }))}>
                    <option value="">Select interpretation</option>
                    {INTERPRETATIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Verified By">
                  <input className={inputCls} value={form.verifiedBy} onChange={e => setForm(f => ({ ...f, verifiedBy: e.target.value }))} />
                </Field>
              </div>
              {isCritical && (
                <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700 font-medium flex items-center gap-2">
                  <span className="text-lg">⚠</span>
                  <span>CRITICAL VALUE — Doctor will be notified immediately. Ensure verbal notification is also made.</span>
                </div>
              )}
              <div className="mt-3">
                <Field label="Remarks / Additional Comments">
                  <textarea className={inputCls} rows={3} value={form.remarks}
                    onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                    placeholder="Quality notes, repeat test recommendations, interfering substances, etc." />
                </Field>
              </div>
            </div>

            {/* Step 5 — Signature */}
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">Step 5 — Authorisation</p>
              <Field label="Technician Signature / Name">
                <input className={inputCls} value={form.techSignature} onChange={e => setForm(f => ({ ...f, techSignature: e.target.value }))} placeholder="Type your full name as signature" />
              </Field>
            </div>

            <div className="flex gap-3 pt-3 border-t">
              <button type="button" onClick={() => { setSelectedId(""); setForm({ specimenType:"", collectedAt:new Date().toISOString().slice(0,16), result:"", unit:"", referenceRange:"", interpretation:"", remarks:"", verifiedBy:"Lab Tech", techSignature:"" }); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Clear Form
              </button>
              <button type="submit" disabled={!selectedId || !form.result || submitting}
                className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Preview & Send Result →
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Completed Tests History ───────────────────────────────────────────────────
function HistoryTab() {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRequests(getLabRequests().filter(r => r.status === "COMPLETED" || r.status === "REJECTED"));
  }, []);

  const filtered = requests.filter(r =>
    `${r.patientName} ${r.testType} ${r.doctorName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Completed Tests</h2>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient, test or doctor..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p>No completed tests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge label={r.status} color={STATUS_COLORS[r.status]} />
                    <Badge label={r.urgency} color={URGENCY_COLORS[r.urgency]} />
                    <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{r.patientName}</p>
                  <p className="text-sm text-yellow-700 font-medium">{r.testType}</p>
                  <p className="text-xs text-gray-500 mt-1">Doctor: {r.doctorName} · Sent: {r.sentAt}</p>
                  {r.completedAt && <p className="text-xs text-gray-400">Completed: {r.completedAt}</p>}
                  {r.result && (
                    <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Result sent to doctor:</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{r.result}</p>
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

// ── Specimen Log ──────────────────────────────────────────────────────────────
function SpecimenLogTab() {
  const [specimens, setSpecimens] = useState([
    { id:"SP-001", patient:"John Doe",     type:"Whole Blood (EDTA)", test:"Full Blood Count",    collected:"Apr 4, 2026 08:30", condition:"Good",     status:"Processed" },
    { id:"SP-002", patient:"Jane Smith",   type:"Serum",              test:"Lipid Profile",        collected:"Apr 4, 2026 09:00", condition:"Good",     status:"Processing" },
    { id:"SP-003", patient:"Ali Hassan",   type:"Urine (Midstream)",  test:"Urinalysis",           collected:"Apr 4, 2026 09:30", condition:"Good",     status:"Pending" },
    { id:"SP-004", patient:"Mary Wanjiku", type:"Whole Blood (EDTA)", test:"Malaria RDT",          collected:"Apr 4, 2026 10:00", condition:"Haemolysed",status:"Rejected" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient:"", type:"Whole Blood (EDTA)", test:"", collected:"", condition:"Good", status:"Pending" });

  const SPECIMEN_TYPES = ["Whole Blood (EDTA)", "Serum", "Plasma", "Urine (Midstream)", "Stool", "Sputum", "Swab", "CSF", "Tissue Biopsy"];
  const CONDITIONS = ["Good", "Haemolysed", "Lipaemic", "Icteric", "Insufficient Volume", "Clotted", "Contaminated"];
  const STATUS_CLS: Record<string,string> = { Processed:"bg-green-100 text-green-700", Processing:"bg-blue-100 text-blue-700", Pending:"bg-yellow-100 text-yellow-700", Rejected:"bg-red-100 text-red-700" };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    setSpecimens(s => [{ id:`SP-${String(s.length+1).padStart(3,"0")}`, ...form }, ...s]);
    setForm({ patient:"", type:"Whole Blood (EDTA)", test:"", collected:"", condition:"Good", status:"Pending" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <Modal title="Log New Specimen" onClose={() => setShowForm(false)}>
          <form onSubmit={add} className="space-y-4">
            <Field label="Patient Name"><input required className={inputCls} value={form.patient} onChange={e=>setForm(f=>({...f,patient:e.target.value}))} /></Field>
            <Field label="Test Requested"><input required className={inputCls} value={form.test} onChange={e=>setForm(f=>({...f,test:e.target.value}))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Specimen Type">
                <select className={inputCls} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {SPECIMEN_TYPES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Condition">
                <select className={inputCls} value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))}>
                  {CONDITIONS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Collection Time"><input type="datetime-local" className={inputCls} value={form.collected} onChange={e=>setForm(f=>({...f,collected:e.target.value}))} /></Field>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">Log Specimen</button>
            </div>
          </form>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Specimen Log</h2>
        <button onClick={()=>setShowForm(true)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">+ Log Specimen</button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead><tr className="bg-gray-50 border-b">{["ID","Patient","Specimen","Test","Collected","Condition","Status"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody>
            {specimens.map(s=>(
              <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{s.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{s.patient}</td>
                <td className="px-4 py-3 text-gray-600">{s.type}</td>
                <td className="px-4 py-3 text-gray-600">{s.test}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{s.collected}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.condition==="Good"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{s.condition}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[s.status]||"bg-gray-100 text-gray-700"}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Quality Control Tab ───────────────────────────────────────────────────────
function QualityControlTab() {
  const [qcLogs, setQcLogs] = useState([
    { id:"QC-001", equipment:"Haematology Analyser",  test:"CBC Control",       result:"Pass", date:"Apr 4, 2026 07:00", tech:"Kevin Otieno",  notes:"All parameters within range" },
    { id:"QC-002", equipment:"Chemistry Analyser",    test:"Glucose Control",   result:"Pass", date:"Apr 4, 2026 07:15", tech:"Kevin Otieno",  notes:"CV < 2%" },
    { id:"QC-003", equipment:"Urine Analyser",        test:"Dipstick Control",  result:"Fail", date:"Apr 4, 2026 07:30", tech:"Kevin Otieno",  notes:"Glucose strip out of range — repeat" },
    { id:"QC-004", equipment:"Microscope",            test:"Calibration Check", result:"Pass", date:"Apr 4, 2026 08:00", tech:"Kevin Otieno",  notes:"Calibrated with standard slide" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ equipment:"", test:"", result:"Pass", notes:"" });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `QC-${String(qcLogs.length+1).padStart(3,"0")}`;
    setQcLogs(q => [{ id, ...form, date:new Date().toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}), tech:"Kevin Otieno" }, ...q]);
    setForm({ equipment:"", test:"", result:"Pass", notes:"" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <Modal title="Log QC Check" onClose={()=>setShowForm(false)}>
          <form onSubmit={add} className="space-y-4">
            <Field label="Equipment"><input required className={inputCls} value={form.equipment} onChange={e=>setForm(f=>({...f,equipment:e.target.value}))} placeholder="e.g. Haematology Analyser" /></Field>
            <Field label="QC Test"><input required className={inputCls} value={form.test} onChange={e=>setForm(f=>({...f,test:e.target.value}))} placeholder="e.g. CBC Control" /></Field>
            <Field label="Result">
              <div className="flex gap-2">
                {["Pass","Fail","Repeat"].map(r=>(
                  <button key={r} type="button" onClick={()=>setForm(f=>({...f,result:r}))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.result===r?(r==="Pass"?"bg-green-600 text-white border-green-600":r==="Fail"?"bg-red-600 text-white border-red-600":"bg-yellow-500 text-white border-yellow-500"):"bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} /></Field>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">Log QC</button>
            </div>
          </form>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Quality Control Log</h2>
        <button onClick={()=>setShowForm(true)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">+ Log QC Check</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[["Pass",qcLogs.filter(q=>q.result==="Pass").length,"bg-green-50 border-green-100 text-green-700"],["Fail",qcLogs.filter(q=>q.result==="Fail").length,"bg-red-50 border-red-100 text-red-700"],["Total",qcLogs.length,"bg-gray-50 border-gray-100 text-gray-700"]].map(([l,v,c])=>(
          <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
        ))}
      </div>
      <div className="space-y-3">
        {qcLogs.map(q=>(
          <div key={q.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${q.result==="Pass"?"border-green-500":q.result==="Fail"?"border-red-500":"border-yellow-500"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${q.result==="Pass"?"bg-green-100 text-green-700":q.result==="Fail"?"bg-red-100 text-red-700":"bg-yellow-100 text-yellow-700"}`}>{q.result}</span>
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

// ── Main Lab Tech Dashboard ───────────────────────────────────────────────────
export default function LabTechDashboard() {
  const [tab, setTab] = useState("overview");
  const [processTarget, setProcessTarget] = useState<LabRequest | null>(null);

  const handleProcess = (r: LabRequest) => { setProcessTarget(r); setTab("process"); };

  // Overview stats
  const allRequests = getLabRequests();
  const pending = allRequests.filter(r => r.status === "PENDING").length;
  const inProgress = allRequests.filter(r => r.status === "IN_PROGRESS").length;
  const completed = allRequests.filter(r => r.status === "COMPLETED").length;

  const OverviewTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Lab Technician Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Pending Requests", pending,    "bg-yellow-600", "📥"],
          ["In Progress",      inProgress, "bg-blue-600",   "🧪"],
          ["Results Sent",     completed,  "bg-green-600",  "✅"],
          ["Total Today",      allRequests.length, "bg-slate-700", "📋"],
        ].map(([label,value,color,icon]) => (
          <div key={label as string} className={`${color} text-white rounded-xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-3xl font-bold">{value}</span>
            </div>
            <p className="text-sm font-medium opacity-90">{label as string}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Incoming Requests","requests","📥","bg-yellow-50 border-yellow-100 text-yellow-700"],
          ["Process & Results","process","🧪","bg-blue-50 border-blue-100 text-blue-700"],
          ["Specimen Log","specimens","🧫","bg-purple-50 border-purple-100 text-purple-700"],
          ["Quality Control","qc","✅","bg-green-50 border-green-100 text-green-700"],
        ].map(([label,id,icon,cls]) => (
          <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
            <div className="text-2xl mb-1">{icon}</div>
            <p className="font-semibold text-sm">{label as string}</p>
            <p className="text-xs opacity-70 mt-0.5">Open →</p>
          </button>
        ))}
      </div>

      {/* What a lab tech does */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Lab Technician Responsibilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["📥 Receive Lab Requests",       "Accept or reject test requests sent by doctors"],
            ["🧫 Specimen Collection & Log",   "Log specimen type, condition, and collection time"],
            ["🧪 Perform Laboratory Tests",    "Process samples using analysers and microscopy"],
            ["📝 Enter & Report Results",      "Record findings and send results back to the doctor"],
            ["✅ Quality Control (QC)",        "Run daily QC checks on all equipment and reagents"],
            ["🔧 Equipment Maintenance",       "Log maintenance, calibration, and service records"],
            ["⚠ Critical Value Reporting",    "Immediately alert doctors for critical/panic values"],
            ["📋 Maintain Test Records",       "Keep accurate records of all tests performed"],
          ].map(([title, desc]) => (
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

      {/* Recent activity */}
      {allRequests.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Requests</h3>
          <div className="space-y-2">
            {allRequests.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${r.status==="COMPLETED"?"bg-green-500":r.status==="IN_PROGRESS"?"bg-blue-500":r.status==="REJECTED"?"bg-red-500":"bg-yellow-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.patientName} — {r.testType}</p>
                  <p className="text-xs text-gray-400">From {r.doctorName} · {r.sentAt}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[r.status]||"bg-gray-100 text-gray-700"}`}>{r.status.replace("_"," ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const EquipmentTab = () => {
    const [equipment, setEquipment] = useState([
      { id:"EQ-001", name:"Haematology Analyser (Sysmex XN-550)", status:"Operational", lastService:"Mar 15, 2026", nextService:"Jun 15, 2026", notes:"Calibrated daily" },
      { id:"EQ-002", name:"Chemistry Analyser (Mindray BS-240)",   status:"Operational", lastService:"Feb 28, 2026", nextService:"May 28, 2026", notes:"QC run every morning" },
      { id:"EQ-003", name:"Urine Analyser (Cobas u 411)",          status:"Needs Service",lastService:"Jan 10, 2026", nextService:"Apr 10, 2026", notes:"Glucose module flagging" },
      { id:"EQ-004", name:"Centrifuge (Hettich EBA 200)",          status:"Operational", lastService:"Mar 1, 2026",  nextService:"Sep 1, 2026",  notes:"Speed verified" },
      { id:"EQ-005", name:"Microscope (Olympus CX23)",             status:"Operational", lastService:"Apr 1, 2026",  nextService:"Oct 1, 2026",  notes:"Calibrated with standard slide" },
      { id:"EQ-006", name:"Refrigerator (Reagent Storage)",        status:"Operational", lastService:"Mar 20, 2026", nextService:"Jun 20, 2026", notes:"Temp: 2–8°C ✓" },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name:"", status:"Operational", lastService:"", nextService:"", notes:"" });

    const add = (e: React.FormEvent) => {
      e.preventDefault();
      setEquipment(eq => [...eq, { id:`EQ-${String(eq.length+1).padStart(3,"0")}`, ...form }]);
      setForm({ name:"", status:"Operational", lastService:"", nextService:"", notes:"" });
      setShowForm(false);
    };

    const STATUS_CLS: Record<string,string> = { Operational:"bg-green-100 text-green-700", "Needs Service":"bg-red-100 text-red-700", "Under Maintenance":"bg-yellow-100 text-yellow-700", "Out of Service":"bg-gray-100 text-gray-600" };

    return (
      <div className="space-y-4">
        {showForm && (
          <Modal title="Add Equipment" onClose={() => setShowForm(false)}>
            <form onSubmit={add} className="space-y-4">
              <Field label="Equipment Name"><input required className={inputCls} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Haematology Analyser" /></Field>
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {["Operational","Needs Service","Under Maintenance","Out of Service"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Last Serviced"><input type="date" className={inputCls} value={form.lastService} onChange={e=>setForm(f=>({...f,lastService:e.target.value}))} /></Field>
                <Field label="Next Service Due"><input type="date" className={inputCls} value={form.nextService} onChange={e=>setForm(f=>({...f,nextService:e.target.value}))} /></Field>
              </div>
              <Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} /></Field>
              <div className="flex gap-3 pt-2 border-t">
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">Add Equipment</button>
              </div>
            </form>
          </Modal>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Equipment & Maintenance</h2>
          <button onClick={()=>setShowForm(true)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">+ Add Equipment</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["Operational",equipment.filter(e=>e.status==="Operational").length,"bg-green-50 border-green-100 text-green-700"],["Needs Service",equipment.filter(e=>e.status==="Needs Service").length,"bg-red-50 border-red-100 text-red-700"],["Total",equipment.length,"bg-gray-50 border-gray-100 text-gray-700"]].map(([l,v,c])=>(
            <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
          ))}
        </div>
        <div className="space-y-3">
          {equipment.map(eq => (
            <div key={eq.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${eq.status==="Operational"?"border-green-500":eq.status==="Needs Service"?"border-red-500":"border-yellow-500"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[eq.status]||"bg-gray-100 text-gray-700"}`}>{eq.status}</span>
                    <span className="text-xs text-gray-400 font-mono">{eq.id}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{eq.name}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>Last service: <strong className="text-gray-700">{eq.lastService}</strong></span>
                    <span>Next due: <strong className={`${new Date(eq.nextService) < new Date() ? "text-red-600" : "text-gray-700"}`}>{eq.nextService}</strong></span>
                  </div>
                  {eq.notes && <p className="text-xs text-gray-400 mt-1 italic">{eq.notes}</p>}
                </div>
                <button onClick={() => setEquipment(prev => prev.map(e => e.id===eq.id ? {...e, status: e.status==="Operational"?"Needs Service":"Operational"} : e))}
                  className="text-xs text-blue-600 hover:underline shrink-0">Toggle Status</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const content: Record<string, ReactNode> = {
    overview:  <OverviewTab />,
    requests:  <IncomingRequestsTab onProcess={handleProcess} />,
    process:   <ProcessResultsTab preselected={processTarget} onDone={() => { setProcessTarget(null); setTab("history"); }} />,
    history:   <HistoryTab />,
    specimens: <SpecimenLogTab />,
    qc:        <QualityControlTab />,
    equipment: <EquipmentTab />,
    profile:   <UserProfile />,
  };

  return (
    <DashboardShell title="Lab Portal" role="Lab Technician" accentColor="bg-yellow-700" icon="🔬" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {content[tab]}
    </DashboardShell>
  );
}
