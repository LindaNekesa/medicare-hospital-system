"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",    label: "Overview",           icon: "📊" },
  { id: "patients",    label: "Patients",           icon: "🦷" },
  { id: "appointments",label: "Appointments",       icon: "📅" },
  { id: "treatment",   label: "Treatment Plans",    icon: "📋" },
  { id: "procedures",  label: "Procedures",         icon: "🔬" },
  { id: "xrays",       label: "Dental X-Rays",      icon: "🩻" },
  { id: "inventory",   label: "Supplies",           icon: "📦" },
  { id: "profile",     label: "My Profile",         icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const PATIENTS = [
  { id:"DP-001", name:"John Doe",     age:39, lastVisit:"Mar 15, 2026", nextVisit:"Apr 15, 2026", condition:"Dental Caries",       status:"Active",   phone:"0733333333" },
  { id:"DP-002", name:"Jane Smith",   age:34, lastVisit:"Feb 20, 2026", nextVisit:"May 20, 2026", condition:"Periodontal Disease", status:"Active",   phone:"0744444444" },
  { id:"DP-003", name:"Ali Hassan",   age:47, lastVisit:"Jan 10, 2026", nextVisit:"Apr 10, 2026", condition:"Root Canal",          status:"Ongoing",  phone:"0755000001" },
  { id:"DP-004", name:"Mary Wanjiku", age:25, lastVisit:"Mar 28, 2026", nextVisit:"Jun 28, 2026", condition:"Orthodontic Review",  status:"Active",   phone:"0755000002" },
];

const APPOINTMENTS = [
  { id:"DA-001", patient:"John Doe",     time:"09:00", procedure:"Filling — Upper Right Molar",  status:"Confirmed", date:"Apr 22, 2026" },
  { id:"DA-002", patient:"Jane Smith",   time:"10:00", procedure:"Scaling & Polishing",           status:"Confirmed", date:"Apr 22, 2026" },
  { id:"DA-003", patient:"Ali Hassan",   time:"11:30", procedure:"Root Canal — Lower Left",       status:"Confirmed", date:"Apr 22, 2026" },
  { id:"DA-004", patient:"Mary Wanjiku", time:"14:00", procedure:"Orthodontic Adjustment",        status:"Pending",   date:"Apr 22, 2026" },
];

const PROCEDURES = [
  { name:"Dental Examination",    code:"D0120", category:"Diagnostic",    duration:"30 min" },
  { name:"Dental X-Ray (Bitewing)",code:"D0274",category:"Diagnostic",    duration:"15 min" },
  { name:"Prophylaxis (Cleaning)", code:"D1110",category:"Preventive",    duration:"45 min" },
  { name:"Composite Filling",      code:"D2391",category:"Restorative",   duration:"60 min" },
  { name:"Root Canal Therapy",     code:"D3310",category:"Endodontic",    duration:"90 min" },
  { name:"Tooth Extraction",       code:"D7140",category:"Oral Surgery",  duration:"30 min" },
  { name:"Crown Placement",        code:"D2740",category:"Restorative",   duration:"120 min" },
  { name:"Orthodontic Adjustment", code:"D8670",category:"Orthodontic",   duration:"30 min" },
];

const SUPPLIES = [
  { item:"Composite Resin",    stock:24, unit:"Syringes", reorder:10, status:"OK" },
  { item:"Dental Gloves (M)",  stock:3,  unit:"Boxes",    reorder:5,  status:"LOW" },
  { item:"Anesthetic Carpules",stock:45, unit:"Units",    reorder:20, status:"OK" },
  { item:"Dental Burs",        stock:8,  unit:"Sets",     reorder:5,  status:"OK" },
  { item:"Impression Material",stock:2,  unit:"Kits",     reorder:4,  status:"CRITICAL" },
  { item:"Suture Material",    stock:15, unit:"Packs",    reorder:8,  status:"OK" },
];

export default function DentalDashboard() {
  const [tab, setTab] = useState("overview");
  const [staffType, setStaffType] = useState("DENTAL_OFFICER");
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [toast, setToast] = useState("");
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<typeof PATIENTS[0] | null>(null);
  const [treatmentForm, setTreatmentForm] = useState({ tooth: "", procedure: "", notes: "", followUp: "" });

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("user") || "{}"); setStaffType(u.staffType || "DENTAL_OFFICER"); } catch { /* ignore */ }
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const markComplete = (id: string) => {
    setAppointments(a => a.map(x => x.id === id ? { ...x, status: "Completed" } : x));
    showToast("Appointment marked as completed");
  };

  const STATUS_COLORS: Record<string, string> = {
    Confirmed: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  const STOCK_COLORS: Record<string, string> = { OK: "bg-green-100 text-green-700", LOW: "bg-yellow-100 text-yellow-700", CRITICAL: "bg-red-100 text-red-700" };

  return (
    <DashboardShell title="Dental Portal" role="Dental Officer" accentColor="bg-cyan-700" icon="🦷" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Dental Overview — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Patients Today", appointments.filter(a => a.status !== "Cancelled").length, "bg-cyan-600", "🦷"],
              ["Completed", appointments.filter(a => a.status === "Completed").length, "bg-green-600", "✅"],
              ["Pending", appointments.filter(a => a.status === "Pending").length, "bg-yellow-500", "⏳"],
              ["Active Patients", PATIENTS.length, "bg-blue-600", "👥"]].map(([l, v, c, i]) => (
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Today&apos;s Schedule</h3>
            <div className="space-y-2">
              {appointments.map(a => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-400 w-12">{a.time}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.patient}</p>
                      <p className="text-xs text-gray-500">{a.procedure}</p>
                    </div>
                  </div>
                  <Badge label={a.status} color={STATUS_COLORS[a.status]} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Dental Officer Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[["🦷 Oral Examination", "Diagnose dental conditions and oral diseases"],
                ["🔬 Restorative Work", "Fillings, crowns, bridges, and dentures"],
                ["💉 Local Anaesthesia", "Administer dental anaesthetics safely"],
                ["🩻 Dental Radiography", "Request and interpret dental X-rays"],
                ["🔪 Oral Surgery", "Extractions, minor surgical procedures"],
                ["🦠 Periodontics", "Treat gum disease and periodontal conditions"],
                ["📋 Treatment Planning", "Develop comprehensive dental care plans"],
                ["💬 Patient Education", "Oral hygiene instruction and prevention"]].map(([t, d]) => (
                <div key={t as string} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="shrink-0">{(t as string).split(" ")[0]}</span>
                  <div><p className="font-medium text-gray-800 text-xs">{(t as string).slice(3)}</p><p className="text-xs text-gray-500">{d as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "patients" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Dental Patients</h2>
            <span className="text-sm text-gray-500">{PATIENTS.length} registered</span>
          </div>
          <div className="space-y-3">
            {PATIENTS.map(p => (
              <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold shrink-0">{p.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <Badge label={p.status} color={p.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} />
                      </div>
                      <p className="text-xs text-gray-500">{p.condition} · Age {p.age}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Last visit: {p.lastVisit} · Next: {p.nextVisit}</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedPatient(p); setShowTreatmentForm(true); }}
                    className="text-xs bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 font-medium shrink-0">
                    Add Treatment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showTreatmentForm && selectedPatient && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTreatmentForm(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b">
                  <h3 className="text-lg font-bold text-gray-900">Treatment Record — {selectedPatient.name}</h3>
                  <button onClick={() => setShowTreatmentForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tooth / Area</label>
                    <input className={inputCls} placeholder="e.g. Upper Right Molar (UR6)" value={treatmentForm.tooth} onChange={e => setTreatmentForm(f => ({ ...f, tooth: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Performed</label>
                    <select className={inputCls} value={treatmentForm.procedure} onChange={e => setTreatmentForm(f => ({ ...f, procedure: e.target.value }))}>
                      <option value="">Select procedure</option>
                      {PROCEDURES.map(p => <option key={p.code} value={p.name}>{p.name} ({p.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                    <textarea className={inputCls} rows={3} placeholder="Findings, materials used, patient response..." value={treatmentForm.notes} onChange={e => setTreatmentForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Instructions</label>
                    <textarea className={inputCls} rows={2} placeholder="Post-treatment care, next appointment..." value={treatmentForm.followUp} onChange={e => setTreatmentForm(f => ({ ...f, followUp: e.target.value }))} />
                  </div>
                  <div className="flex gap-3 pt-2 border-t">
                    <button onClick={() => setShowTreatmentForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                    <button onClick={() => { setShowTreatmentForm(false); showToast(`Treatment recorded for ${selectedPatient.name}`); setTreatmentForm({ tooth: "", procedure: "", notes: "", followUp: "" }); }}
                      className="flex-1 bg-cyan-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-cyan-700">Save Record</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "appointments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Appointments</h2>
            <button onClick={() => showToast("Appointment booking form — connect to appointments API")}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700">+ Book Appointment</button>
          </div>
          <div className="space-y-3">
            {appointments.map(a => (
              <div key={a.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${a.status === "Completed" ? "border-green-500" : a.status === "Pending" ? "border-yellow-400" : "border-cyan-500"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={a.status} color={STATUS_COLORS[a.status]} />
                      <span className="text-xs text-gray-400 font-mono">{a.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{a.patient}</p>
                    <p className="text-sm text-cyan-700 font-medium">{a.procedure}</p>
                    <p className="text-xs text-gray-400 mt-1">📅 {a.date} · ⏰ {a.time}</p>
                  </div>
                  {a.status !== "Completed" && (
                    <button onClick={() => markComplete(a.id)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium shrink-0">Mark Done</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "treatment" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Treatment Plans</h2>
          {PATIENTS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-sm text-cyan-700 font-medium">{p.condition}</p>
                  <div className="mt-3 space-y-1.5">
                    {["Initial examination and X-rays", "Treatment of active disease", "Restorative work", "Maintenance and review"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < 2 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{i < 2 ? "✓" : i + 1}</span>
                        <span className={i < 2 ? "text-gray-500 line-through" : "text-gray-700"}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Badge label={p.status} color={p.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "procedures" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Dental Procedures Reference</h2>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Procedure", "Code", "Category", "Duration"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {PROCEDURES.map(p => (
                  <tr key={p.code} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.code}</td>
                    <td className="px-4 py-3"><Badge label={p.category} color="bg-cyan-100 text-cyan-700" /></td>
                    <td className="px-4 py-3 text-gray-500">{p.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "xrays" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Dental X-Rays</h2>
          <div className="space-y-3">
            {[{ patient: "John Doe", type: "Periapical", tooth: "UR6", date: "Apr 8, 2026", finding: "Periapical abscess noted. Root canal indicated." },
              { patient: "Ali Hassan", type: "Panoramic (OPG)", tooth: "Full mouth", date: "Mar 20, 2026", finding: "Impacted lower wisdom teeth. Extraction recommended." },
              { patient: "Mary Wanjiku", type: "Cephalometric", tooth: "Full skull", date: "Feb 15, 2026", finding: "Class II malocclusion. Orthodontic treatment planned." }].map(x => (
              <div key={x.patient} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{x.patient}</p>
                    <p className="text-sm text-cyan-700 font-medium">{x.type} — {x.tooth}</p>
                    <p className="text-xs text-gray-400 mt-1">📅 {x.date}</p>
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 mb-0.5">Radiographic Findings</p>
                      <p className="text-xs text-gray-600">{x.finding}</p>
                    </div>
                  </div>
                  <button onClick={() => showToast("X-ray viewer — connect to PACS system")}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium shrink-0">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Dental Supplies</h2>
          <div className="grid grid-cols-3 gap-3">
            {[["OK", SUPPLIES.filter(s => s.status === "OK").length, "bg-green-50 border-green-100 text-green-700"],
              ["Low Stock", SUPPLIES.filter(s => s.status === "LOW").length, "bg-yellow-50 border-yellow-100 text-yellow-700"],
              ["Critical", SUPPLIES.filter(s => s.status === "CRITICAL").length, "bg-red-50 border-red-100 text-red-700"]].map(([l, v, c]) => (
              <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Item", "Stock", "Unit", "Reorder Level", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {SUPPLIES.map(s => (
                  <tr key={s.item} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.item}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{s.stock}</td>
                    <td className="px-4 py-3 text-gray-500">{s.unit}</td>
                    <td className="px-4 py-3 text-gray-400">{s.reorder}</td>
                    <td className="px-4 py-3"><Badge label={s.status} color={STOCK_COLORS[s.status]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
