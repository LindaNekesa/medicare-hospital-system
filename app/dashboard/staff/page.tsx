"use client";
import { useState, useEffect, ReactNode, useRef } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import { addLabRequest, getLabRequests, LabRequest } from "@/lib/labStore";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",  label: "Overview",      icon: "📊" },
  { id: "triage",    label: "Triage",        icon: "🚨" },
  { id: "patients",  label: "My Patients",   icon: "🏥" },
  { id: "lab",       label: "Lab Requests",  icon: "🔬" },
  { id: "schedule",  label: "Schedule",      icon: "📅" },
  { id: "profile",   label: "My Profile",    icon: "👤" },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);
const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

// ── Sample patients ───────────────────────────────────────────────────────────
const PATIENTS = [
  { id:"P-001", name:"John Doe",     age:39, sex:"M", blood:"O+",  condition:"Hypertension",       status:"Active",   phone:"0733333333" },
  { id:"P-002", name:"Jane Smith",   age:34, sex:"F", blood:"A+",  condition:"Diabetes Type 2",    status:"Active",   phone:"0744444444" },
  { id:"P-003", name:"Ali Hassan",   age:47, sex:"M", blood:"B+",  condition:"Cardiac Arrhythmia", status:"Admitted", phone:"0755000001" },
  { id:"P-004", name:"Mary Wanjiku", age:25, sex:"F", blood:"AB+", condition:"Prenatal Care",      status:"Active",   phone:"0755000002" },
  { id:"P-005", name:"Samuel Kibet", age:55, sex:"M", blood:"B-",  condition:"Renal Failure",      status:"Critical", phone:"0777000001" },
];

const LAB_TESTS = [
  "Full Blood Count (FBC)", "Blood Sugar (Fasting)", "Blood Sugar (Random)", "HbA1c",
  "Lipid Profile", "Liver Function Tests (LFTs)", "Renal Function Tests (RFTs)",
  "Thyroid Function Tests", "Malaria RDT", "Malaria Smear", "HIV Test",
  "Hepatitis B Surface Antigen", "Urinalysis", "Urine Culture & Sensitivity",
  "Blood Culture & Sensitivity", "Chest X-Ray", "ECG", "Ultrasound Abdomen",
  "Sputum AFB (TB)", "Widal Test", "CRP", "ESR", "Coagulation Profile",
];

// ── Triage Tab ────────────────────────────────────────────────────────────────
function TriageTab() {
  const [triages, setTriages] = useState([
    { id:"T-001", name:"John Doe",     age:39, sex:"M", complaint:"Chest pain, shortness of breath", bp:"145/95", pulse:98,  temp:37.2, spo2:94, priority:"CRITICAL", time:"08:45", status:"Seen" },
    { id:"T-002", name:"Grace Otieno", age:18, sex:"F", complaint:"Asthma attack, wheezing",         bp:"110/70", pulse:112, temp:37.8, spo2:91, priority:"URGENT",   time:"09:10", status:"Waiting" },
    { id:"T-003", name:"Peter Mwangi", age:62, sex:"M", complaint:"Post-op wound check",             bp:"130/80", pulse:76,  temp:36.8, spo2:98, priority:"ROUTINE",  time:"09:30", status:"Waiting" },
    { id:"T-004", name:"Fatuma Abdi",  age:29, sex:"F", complaint:"Labour pains, 38 weeks",          bp:"120/75", pulse:88,  temp:37.0, spo2:99, priority:"URGENT",   time:"09:45", status:"Waiting" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", age:"", sex:"M", complaint:"", bp:"", pulse:"", temp:"", spo2:"", priority:"ROUTINE" });
  const [toast, setToast] = useState("");

  const PRIORITY_COLORS: Record<string,string> = { CRITICAL:"bg-red-100 text-red-700 border-red-200", URGENT:"bg-orange-100 text-orange-700 border-orange-200", ROUTINE:"bg-green-100 text-green-700 border-green-200" };

  const addTriage = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `T-${String(triages.length+1).padStart(3,"0")}`;
    setTriages(t => [{ id, ...form, age: Number(form.age), pulse: Number(form.pulse), temp: Number(form.temp), spo2: Number(form.spo2), time: new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}), status:"Waiting" }, ...t]);
    setForm({ name:"", age:"", complaint:"", bp:"", pulse:"", temp:"", spo2:"", priority:"ROUTINE" });
    setShowForm(false);
    setToast("Patient triaged successfully");
    setTimeout(() => setToast(""), 3000);
  };

  const sorted = [...triages].sort((a,b) => { const o = {CRITICAL:0,URGENT:1,ROUTINE:2}; return (o[a.priority as keyof typeof o]||2) - (o[b.priority as keyof typeof o]||2); });

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Triage Queue</h2>
          <p className="text-sm text-gray-500 mt-0.5">Patients sorted by priority — Critical first</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">+ Triage Patient</button>
      </div>

      {showForm && (
        <Modal title="New Triage Assessment" onClose={() => setShowForm(false)}>
          <form onSubmit={addTriage} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Patient Name"><input required className={inputCls} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" /></Field>
              <Field label="Age"><input required type="number" className={inputCls} value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))} placeholder="35" /></Field>
            </div>
            <Field label="Chief Complaint"><textarea required className={inputCls} rows={2} value={form.complaint} onChange={e=>setForm(f=>({...f,complaint:e.target.value}))} placeholder="Describe presenting complaint..." /></Field>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="BP (mmHg)"><input className={inputCls} value={form.bp} onChange={e=>setForm(f=>({...f,bp:e.target.value}))} placeholder="120/80" /></Field>
              <Field label="Pulse (bpm)"><input type="number" className={inputCls} value={form.pulse} onChange={e=>setForm(f=>({...f,pulse:e.target.value}))} placeholder="72" /></Field>
              <Field label="Temp (°C)"><input type="number" step="0.1" className={inputCls} value={form.temp} onChange={e=>setForm(f=>({...f,temp:e.target.value}))} placeholder="37.0" /></Field>
              <Field label="SpO₂ (%)"><input type="number" className={inputCls} value={form.spo2} onChange={e=>setForm(f=>({...f,spo2:e.target.value}))} placeholder="98" /></Field>
            </div>
            <Field label="Priority Level">
              <div className="grid grid-cols-3 gap-2">
                {["ROUTINE","URGENT","CRITICAL"].map(p => (
                  <button key={p} type="button" onClick={() => setForm(f=>({...f,priority:p}))}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${form.priority===p ? (p==="CRITICAL"?"bg-red-600 text-white border-red-600":p==="URGENT"?"bg-orange-500 text-white border-orange-500":"bg-green-600 text-white border-green-600") : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </Field>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Submit Triage</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[["CRITICAL",sorted.filter(t=>t.priority==="CRITICAL").length,"bg-red-50 border-red-100 text-red-700"],["URGENT",sorted.filter(t=>t.priority==="URGENT").length,"bg-orange-50 border-orange-100 text-orange-700"],["ROUTINE",sorted.filter(t=>t.priority==="ROUTINE").length,"bg-green-50 border-green-100 text-green-700"]].map(([p,c,cls])=>(
          <div key={p} className={`rounded-xl p-4 border text-center ${cls}`}><p className="text-2xl font-bold">{c}</p><p className="text-xs font-medium mt-0.5">{p}</p></div>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map(t => (
          <div key={t.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${t.priority==="CRITICAL"?"border-red-500":t.priority==="URGENT"?"border-orange-500":"border-green-500"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                  <span className="text-xs text-gray-400 font-mono">{t.id}</span>
                  <span className="text-xs text-gray-400">· {t.time}</span>
                </div>
                <p className="font-semibold text-gray-900">{t.name} <span className="text-gray-400 font-normal text-sm">({t.age}y, {t.sex})</span></p>
                <p className="text-sm text-gray-600 mt-0.5">{t.complaint}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>BP: <strong className="text-gray-700">{t.bp}</strong></span>
                  <span>Pulse: <strong className="text-gray-700">{t.pulse}</strong></span>
                  <span>Temp: <strong className="text-gray-700">{t.temp}°C</strong></span>
                  <span>SpO₂: <strong className={`${Number(t.spo2) < 95 ? "text-red-600" : "text-gray-700"}`}>{t.spo2}%</strong></span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge label={t.status} color={t.status==="Seen"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                {t.status === "Waiting" && (
                  <button onClick={() => setTriages(prev => prev.map(x => x.id===t.id ? {...x,status:"Seen"} : x))}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                    Mark Seen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Clinical Summary Tab ──────────────────────────────────────────────────────
function ClinicalSummaryTab() {
  const [summaries, setSummaries] = useState([
    { id:"CS-001", patient:"John Doe", date:"Apr 1, 2026", diagnosis:"Hypertension Stage 2", summary:"Patient presents with persistent elevated BP. Started on Amlodipine 5mg OD. Advised low-sodium diet and daily BP monitoring.", plan:"Review in 4 weeks. Repeat BP check.", status:"Final" },
    { id:"CS-002", patient:"Jane Smith", date:"Mar 30, 2026", diagnosis:"Type 2 Diabetes Mellitus", summary:"HbA1c at 8.2%. Metformin dose increased to 1g BD. Patient counselled on diet and exercise.", plan:"Repeat HbA1c in 3 months. Refer to dietitian.", status:"Final" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<typeof summaries[0] | null>(null);
  const [form, setForm] = useState({ patient:"", date:"", diagnosis:"", chiefComplaint:"", history:"", examination:"", investigations:"", summary:"", plan:"", status:"Draft" });
  const [toast, setToast] = useState("");

  const openNew = () => { setEditing(null); setForm({ patient:"", date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), diagnosis:"", chiefComplaint:"", history:"", examination:"", investigations:"", summary:"", plan:"", status:"Draft" }); setShowForm(true); };
  const openEdit = (s: typeof summaries[0]) => { setEditing(s); setForm({ patient:s.patient, date:s.date, diagnosis:s.diagnosis, chiefComplaint:"", history:"", examination:"", investigations:"", summary:s.summary, plan:s.plan, status:s.status }); setShowForm(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setSummaries(p => p.map(x => x.id===editing.id ? {...x,...form} : x));
      setToast("Clinical summary updated");
    } else {
      const id = `CS-${String(summaries.length+1).padStart(3,"0")}`;
      setSummaries(p => [{ id, ...form }, ...p]);
      setToast("Clinical summary saved");
    }
    setShowForm(false);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Clinical Summaries</h2>
        <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ New Summary</button>
      </div>

      {showForm && (
        <Modal title={editing ? "Edit Clinical Summary" : "New Clinical Summary"} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Patient">
                <select className={inputCls} value={form.patient} onChange={e=>setForm(f=>({...f,patient:e.target.value}))}>
                  <option value="">Select patient</option>
                  {PATIENTS.map(p => <option key={p.id} value={p.name}>{p.name} ({p.id})</option>)}
                </select>
              </Field>
              <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></Field>
            </div>
            <Field label="Diagnosis / Impression"><input required className={inputCls} value={form.diagnosis} onChange={e=>setForm(f=>({...f,diagnosis:e.target.value}))} placeholder="Primary diagnosis" /></Field>
            <Field label="Chief Complaint"><textarea className={inputCls} rows={2} value={form.chiefComplaint} onChange={e=>setForm(f=>({...f,chiefComplaint:e.target.value}))} placeholder="Patient's presenting complaint..." /></Field>
            <Field label="History of Presenting Illness"><textarea className={inputCls} rows={3} value={form.history} onChange={e=>setForm(f=>({...f,history:e.target.value}))} placeholder="Onset, duration, character, associated symptoms..." /></Field>
            <Field label="Physical Examination Findings"><textarea className={inputCls} rows={3} value={form.examination} onChange={e=>setForm(f=>({...f,examination:e.target.value}))} placeholder="Vital signs, systemic examination findings..." /></Field>
            <Field label="Investigations Ordered / Results"><textarea className={inputCls} rows={2} value={form.investigations} onChange={e=>setForm(f=>({...f,investigations:e.target.value}))} placeholder="Lab results, imaging findings..." /></Field>
            <Field label="Clinical Summary / Assessment"><textarea required className={inputCls} rows={4} value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))} placeholder="Overall clinical assessment and reasoning..." /></Field>
            <Field label="Management Plan"><textarea required className={inputCls} rows={3} value={form.plan} onChange={e=>setForm(f=>({...f,plan:e.target.value}))} placeholder="Treatment plan, medications, referrals, follow-up..." /></Field>
            <Field label="Status">
              <div className="flex gap-2">
                {["Draft","Final"].map(s => (
                  <button key={s} type="button" onClick={() => setForm(f=>({...f,status:s}))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.status===s?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save Summary</button>
            </div>
          </form>
        </Modal>
      )}

      {summaries.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 border"><p>No clinical summaries yet</p></div>
      ) : (
        <div className="space-y-3">
          {summaries.map(s => (
            <div key={s.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">{s.id}</span>
                    <Badge label={s.status} color={s.status==="Final"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                    <span className="text-xs text-gray-400">{s.date}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{s.patient}</p>
                  <p className="text-sm text-blue-700 font-medium mt-0.5">{s.diagnosis}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{s.summary}</p>
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">Management Plan</p>
                    <p className="text-xs text-gray-600">{s.plan}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(s)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-medium">Edit</button>
                  <button onClick={() => setSummaries(p => p.filter(x => x.id !== s.id))} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Lab Requests Tab (Doctor side) ────────────────────────────────────────────
function LabRequestsTab() {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientName:"", patientId:"", testType:"", urgency:"ROUTINE" as LabRequest["urgency"], clinicalNotes:"" });
  const [toast, setToast] = useState("");
  const [newResults, setNewResults] = useState<Set<string>>(new Set());
  const prevCompleted = useRef<Set<string>>(new Set());

  // Poll every 3 seconds — auto-detect when lab tech submits a result
  useEffect(() => {
    const poll = () => {
      const latest = getLabRequests();
      setRequests(latest);

      // Find newly completed requests since last poll
      const justCompleted = latest.filter(r =>
        r.status === "COMPLETED" && r.result && !prevCompleted.current.has(r.id)
      );
      if (justCompleted.length > 0) {
        const ids = new Set(justCompleted.map(r => r.id));
        setNewResults(prev => new Set([...prev, ...ids]));
        setToast(`🔬 Lab result received for ${justCompleted.map(r => r.patientName).join(", ")}`);
        setTimeout(() => setToast(""), 5000);
      }
      prevCompleted.current = new Set(latest.filter(r => r.status === "COMPLETED").map(r => r.id));
    };

    poll(); // immediate first load
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  const dismissNew = (id: string) => setNewResults(prev => { const s = new Set(prev); s.delete(id); return s; });

  const sendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addLabRequest({ ...form, doctorName: "Dr. Sarah Johnson" });
    setRequests(getLabRequests());
    setForm({ patientName:"", patientId:"", testType:"", urgency:"ROUTINE", clinicalNotes:"" });
    setShowForm(false);
    setToast(`✓ Lab request sent for ${form.patientName}`);
    setTimeout(() => setToast(""), 3500);
  };

  const URGENCY_COLORS: Record<string,string> = { ROUTINE:"bg-green-100 text-green-700", URGENT:"bg-orange-100 text-orange-700", STAT:"bg-red-100 text-red-700" };
  const STATUS_COLORS: Record<string,string> = { PENDING:"bg-yellow-100 text-yellow-700", IN_PROGRESS:"bg-blue-100 text-blue-700", COMPLETED:"bg-green-100 text-green-700", REJECTED:"bg-red-100 text-red-700" };

  const pending = requests.filter(r => r.status === "PENDING").length;
  const inProgress = requests.filter(r => r.status === "IN_PROGRESS").length;
  const completed = requests.filter(r => r.status === "COMPLETED").length;

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Lab Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Results auto-update every 3 seconds</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">🔬 Send Lab Request</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center"><p className="text-xl font-bold text-yellow-700">{pending}</p><p className="text-xs text-yellow-600 font-medium">Pending</p></div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center"><p className="text-xl font-bold text-blue-700">{inProgress}</p><p className="text-xs text-blue-600 font-medium">In Progress</p></div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center"><p className="text-xl font-bold text-green-700">{completed}</p><p className="text-xs text-green-600 font-medium">Results Ready</p></div>
      </div>

      {showForm && (
        <Modal title="Send Lab Request" onClose={() => setShowForm(false)}>
          <form onSubmit={sendRequest} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Patient">
                <select required className={inputCls} value={form.patientId} onChange={e => { const p = PATIENTS.find(x=>x.id===e.target.value); setForm(f=>({...f,patientId:e.target.value,patientName:p?.name||""})); }}>
                  <option value="">Select patient</option>
                  {PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Urgency">
                <select className={inputCls} value={form.urgency} onChange={e=>setForm(f=>({...f,urgency:e.target.value as LabRequest["urgency"]}))}>
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent</option>
                  <option value="STAT">STAT (Immediate)</option>
                </select>
              </Field>
            </div>
            <Field label="Test Required">
              <select required className={inputCls} value={form.testType} onChange={e=>setForm(f=>({...f,testType:e.target.value}))}>
                <option value="">Select test</option>
                {LAB_TESTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Clinical Notes / Reason">
              <textarea required className={inputCls} rows={3} value={form.clinicalNotes} onChange={e=>setForm(f=>({...f,clinicalNotes:e.target.value}))} placeholder="Relevant clinical information for the lab technician..." />
            </Field>
            {form.urgency === "STAT" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">⚠ STAT request — lab technician will be notified immediately</div>
            )}
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">Send to Lab</button>
            </div>
          </form>
        </Modal>
      )}

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="text-4xl mb-3">🔬</div>
          <p className="text-gray-500">No lab requests sent yet</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-sm text-blue-600 hover:underline">Send your first request</button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => {
            const isNew = newResults.has(r.id);
            return (
              <div key={r.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 transition-all ${isNew ? "ring-2 ring-green-400 border-green-500" : r.urgency==="STAT"?"border-red-500":r.urgency==="URGENT"?"border-orange-500":"border-blue-400"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge label={r.urgency} color={URGENCY_COLORS[r.urgency]} />
                      <Badge label={r.status.replace("_"," ")} color={STATUS_COLORS[r.status]} />
                      {isNew && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-600 text-white animate-pulse">NEW RESULT</span>}
                      <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{r.patientName}</p>
                    <p className="text-sm text-blue-700 font-medium">{r.testType}</p>
                    <p className="text-xs text-gray-500 mt-1 italic">{r.clinicalNotes}</p>
                    <p className="text-xs text-gray-400 mt-1">Sent: {r.sentAt}</p>

                    {/* Result — shown automatically when lab tech submits */}
                    {r.result ? (
                      <div className={`mt-3 p-3 rounded-lg border ${isNew ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">🔬 Lab Result</p>
                          {r.completedAt && <p className="text-xs text-gray-400">{r.completedAt}</p>}
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.result}</p>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        {r.status === "IN_PROGRESS" ? (
                          <><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />Lab technician is processing...</>
                        ) : r.status === "PENDING" ? (
                          <><span className="w-2 h-2 bg-yellow-500 rounded-full" />Waiting for lab technician to accept</>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {isNew && (
                    <button onClick={() => dismissNew(r.id)} className="text-xs text-gray-400 hover:text-gray-600 shrink-0 mt-1">✕</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── RBAC: which staffTypes can access which tabs ──────────────────────────────
const DOCTOR_TYPES = new Set(["DOCTOR","SURGEON","SPECIALIST","RESIDENT_DOCTOR","INTERN_DOCTOR","ANESTHESIOLOGIST","ICU_SPECIALIST","PSYCHIATRIST","CLINICAL_OFFICER"]);
const NURSE_TYPES  = new Set(["NURSE","SENIOR_NURSE","MIDWIFE","NURSE_ANESTHETIST"]);

function AccessDenied({ tab }: { tab: string }) {
  return (
    <div className="bg-white rounded-xl border border-red-200 p-10 text-center">
      <div className="text-4xl mb-3">🚫</div>
      <p className="font-semibold text-red-700 text-lg">Access Restricted</p>
      <p className="text-sm text-gray-500 mt-2">Your role does not have permission to access <strong>{tab}</strong>.</p>
      <p className="text-xs text-gray-400 mt-1">Contact your administrator if you believe this is an error.</p>
    </div>
  );
}

// ── Main Staff Dashboard ──────────────────────────────────────────────────────
export default function MedicalStaffDashboard() {
  const [tab, setTab] = useState("overview");
  const [staffType, setStaffType] = useState<string>("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setStaffType(u.staffType || "DOCTOR");
    } catch { /* ignore */ }
  }, []);

  const isDoctor = DOCTOR_TYPES.has(staffType);
  const isNurse  = NURSE_TYPES.has(staffType);

  // Build nav based on staffType
  const navItems = [
    { id: "overview",  label: "Overview",        icon: "📊" },
    ...(isDoctor || isNurse ? [{ id: "triage", label: "Triage", icon: "🚨" }] : []),
    { id: "patients",  label: "My Patients",     icon: "🏥" },
    ...(isDoctor ? [{ id: "lab", label: "Lab Requests", icon: "🔬" }] : []),
    { id: "schedule",  label: "Schedule",        icon: "📅" },
    { id: "profile",   label: "My Profile",      icon: "👤" },
  ];

  const staffLabel = staffType ? staffType.replace(/_/g, " ") : "Medical Staff";

  const content: Record<string, ReactNode> = {
    overview: (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Today&apos;s Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Welcome, {staffLabel}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Today's Patients" value="12" icon="🏥" color="bg-blue-600" />
          {(isDoctor || isNurse) && <StatCard label="Triage Queue" value="4" icon="🚨" color="bg-red-500" />}
          {isDoctor && <StatCard label="Lab Requests" value="3" icon="🔬" color="bg-yellow-500" />}
          <StatCard label="Schedule" value="8" icon="📅" color="bg-green-600" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(isDoctor || isNurse) && (
            <button onClick={() => setTab("triage")} className="rounded-xl p-4 border text-left hover:shadow-md transition-shadow bg-red-50 border-red-100 text-red-700">
              <div className="text-2xl mb-1">🚨</div>
              <p className="font-semibold text-sm">Triage</p>
              <p className="text-xs opacity-70 mt-0.5">Open →</p>
            </button>
          )}
          {isDoctor && (
            <button onClick={() => setTab("lab")} className="rounded-xl p-4 border text-left hover:shadow-md transition-shadow bg-yellow-50 border-yellow-100 text-yellow-700">
              <div className="text-2xl mb-1">🔬</div>
              <p className="font-semibold text-sm">Lab Requests</p>
              <p className="text-xs opacity-70 mt-0.5">Open →</p>
            </button>
          )}
          <button onClick={() => setTab("patients")} className="rounded-xl p-4 border text-left hover:shadow-md transition-shadow bg-blue-50 border-blue-100 text-blue-700">
            <div className="text-2xl mb-1">🏥</div>
            <p className="font-semibold text-sm">My Patients</p>
            <p className="text-xs opacity-70 mt-0.5">Open →</p>
          </button>
          <button onClick={() => setTab("schedule")} className="rounded-xl p-4 border text-left hover:shadow-md transition-shadow bg-green-50 border-green-100 text-green-700">
            <div className="text-2xl mb-1">📅</div>
            <p className="font-semibold text-sm">Schedule</p>
            <p className="text-xs opacity-70 mt-0.5">Open →</p>
          </button>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-3">Today&apos;s Schedule</h3>
          {[["09:00","John Doe","General Checkup","CONFIRMED"],["10:30","Jane Smith","Follow-up","PENDING"],["11:00","Ali Hassan","Consultation","CONFIRMED"],["14:00","Mary Wanjiku","Lab Review","PENDING"]].map(([time,name,reason,status])=>(
            <div key={time} className="flex items-center gap-4 py-2.5 border-b last:border-0">
              <span className="text-sm font-mono text-gray-500 w-14 shrink-0">{time}</span>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{name}</p><p className="text-xs text-gray-500">{reason}</p></div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status==="CONFIRMED"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    triage:   (isDoctor || isNurse) ? <TriageTab /> : <AccessDenied tab="Triage" />,
    lab:      isDoctor ? <LabRequestsTab /> : <AccessDenied tab="Lab Requests" />,
    patients: <div className="bg-white rounded-xl p-8 text-center text-gray-400 border"><div className="text-4xl mb-3">🏥</div><p className="font-medium text-gray-600">My Patients</p></div>,
    schedule: <div className="bg-white rounded-xl p-8 text-center text-gray-400 border"><div className="text-4xl mb-3">📅</div><p className="font-medium text-gray-600">Schedule</p></div>,
    profile:  <UserProfile />,
  };

  return (
    <DashboardShell title="Staff Portal" role={staffLabel} accentColor="bg-blue-700" icon="🩺" navItems={navItems} activeTab={tab} onTabChange={setTab}>
      {content[tab]}
    </DashboardShell>
  );
}
