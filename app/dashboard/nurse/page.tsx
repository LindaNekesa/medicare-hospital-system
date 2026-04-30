"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";
import { getTriageQueue, addTriagePatient, updateTriagePatient, TriagePatient } from "@/lib/triageStore";

const NAV = [
  { id: "overview",    label: "Overview",          icon: "📊" },
  { id: "triage",      label: "Triage & Vitals",   icon: "🚨" },
  { id: "patients",    label: "My Patients",        icon: "🏥" },
  { id: "medications", label: "Medication Admin",   icon: "💊" },
  { id: "care",        label: "Care Plans",         icon: "📋" },
  { id: "handover",    label: "Shift Handover",     icon: "🔄" },
  { id: "schedule",    label: "Schedule",           icon: "📅" },
  { id: "profile",     label: "My Profile",         icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const PATIENTS = [
  { id:"P-001", name:"John Doe",     ward:"Cardiology", bed:"C-01", condition:"Hypertension",    bp:"145/95", pulse:88, temp:37.2, spo2:97, status:"Stable",   doctor:"Dr. Sarah Johnson" },
  { id:"P-003", name:"Ali Hassan",   ward:"Cardiology", bed:"C-02", condition:"Cardiac Arrhythmia",bp:"130/85",pulse:92,temp:37.5,spo2:95, status:"Monitoring",doctor:"Dr. Sarah Johnson" },
  { id:"P-005", name:"Samuel Kibet", ward:"General",    bed:"G-01", condition:"Renal Failure",   bp:"160/100",pulse:78,temp:37.0,spo2:94, status:"Critical",  doctor:"Dr. Peter Kamau" },
];

const MEDICATIONS = [
  { patient:"John Doe",     drug:"Amlodipine 5mg",  dose:"Once daily",  time:"08:00", given:true,  route:"Oral" },
  { patient:"John Doe",     drug:"Aspirin 75mg",    dose:"Once daily",  time:"08:00", given:true,  route:"Oral" },
  { patient:"Ali Hassan",   drug:"Digoxin 0.25mg",  dose:"Once daily",  time:"08:00", given:false, route:"Oral" },
  { patient:"Samuel Kibet", drug:"Furosemide 40mg", dose:"Twice daily", time:"08:00", given:false, route:"IV" },
  { patient:"Samuel Kibet", drug:"Furosemide 40mg", dose:"Twice daily", time:"18:00", given:false, route:"IV" },
];

export default function NurseDashboard() {
  const [tab, setTab] = useState("overview");
  const [staffType, setStaffType] = useState("NURSE");
  const [staffName, setStaffName] = useState("Nurse");
  const [meds, setMeds] = useState(MEDICATIONS);
  const [triageQueue, setTriageQueue] = useState<TriagePatient[]>([]);
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [triageForm, setTriageForm] = useState({ name:"", age:"", sex:"M", complaint:"", bp:"", pulse:"", temp:"", spo2:"", priority:"ROUTINE" as TriagePatient["priority"] });
  const [vitals, setVitals] = useState(PATIENTS);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setStaffType(u.staffType || "NURSE");
      setStaffName(u.name || "Nurse");
    } catch { /* ignore */ }
  }, []);

  // Poll triage queue every 3 seconds
  useEffect(() => {
    const load = () => setTriageQueue(getTriageQueue());
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const roleLabel = staffType === "MIDWIFE" ? "Midwife" : staffType === "SENIOR_NURSE" ? "Senior Nurse" : staffType === "NURSE_ANESTHETIST" ? "Nurse Anaesthetist" : "Registered Nurse";
  const accentColor = staffType === "MIDWIFE" ? "bg-pink-700" : "bg-green-700";
  const icon = staffType === "MIDWIFE" ? "🤱" : "👩‍⚕️";

  const toggleMed = (idx: number) => {
    setMeds(m => m.map((x, i) => i === idx ? { ...x, given: !x.given } : x));
    setToast("Medication record updated");
    setTimeout(() => setToast(""), 2000);
  };

  const STATUS_COLORS: Record<string, string> = { Stable: "bg-green-100 text-green-700", Monitoring: "bg-yellow-100 text-yellow-700", Critical: "bg-red-100 text-red-700" };

  return (
    <DashboardShell title="Nursing Portal" role={roleLabel} accentColor={accentColor} icon={icon} navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Nursing Overview — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Patients on Ward", PATIENTS.length, "bg-green-600", "🏥"],
              ["Meds Due", meds.filter(m => !m.given).length, "bg-orange-500", "💊"],
              ["Critical Patients", PATIENTS.filter(p => p.status === "Critical").length, "bg-red-600", "⚠️"],
              ["Shift", "Morning", "bg-blue-600", "🕐"]].map(([l, v, c, i]) => (
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Triage & Vitals","triage","🚨","bg-red-50 border-red-100 text-red-700"],
              ["Medication Admin","medications","💊","bg-orange-50 border-orange-100 text-orange-700"],
              ["My Patients","patients","🏥","bg-green-50 border-green-100 text-green-700"],
              ["Care Plans","care","📋","bg-blue-50 border-blue-100 text-blue-700"]].map(([l, id, ic, cls]) => (
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{ic}</div>
                <p className="font-semibold text-sm">{l as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Nursing Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[["🩺 Patient Assessment","Monitor vitals, assess patient condition"],
                ["💊 Medication Administration","Administer prescribed medications safely"],
                ["🩹 Wound Care","Dress wounds, change dressings"],
                ["📋 Care Planning","Develop and update nursing care plans"],
                ["🔄 Shift Handover","Report patient status to incoming shift"],
                ["📞 Doctor Communication","Report changes in patient condition"],
                ["🧪 Specimen Collection","Collect blood, urine, and other samples"],
                ["❤️ Patient Education","Educate patients on care and medications"]].map(([t, d]) => (
                <div key={t as string} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="shrink-0">{(t as string).split(" ")[0]}</span>
                  <div><p className="font-medium text-gray-800 text-xs">{(t as string).slice(3)}</p><p className="text-xs text-gray-500">{d as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "triage" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Triage & Vital Signs</h2>
            <button onClick={() => setShowTriageForm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">+ Triage Patient</button>
          </div>

          {showTriageForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTriageForm(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b">
                  <h3 className="text-lg font-bold text-gray-900">New Triage Assessment</h3>
                  <button onClick={() => setShowTriageForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>
                <form className="p-5 space-y-4" onSubmit={e => {
                  e.preventDefault();
                  addTriagePatient({
                    name: triageForm.name, age: Number(triageForm.age), sex: triageForm.sex,
                    complaint: triageForm.complaint, bp: triageForm.bp,
                    pulse: Number(triageForm.pulse), temp: Number(triageForm.temp), spo2: Number(triageForm.spo2),
                    priority: triageForm.priority,
                    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                    status: "Waiting",
                    triageBy: staffName,
                  });
                  setTriageQueue(getTriageQueue());
                  setTriageForm({ name:"", age:"", sex:"M", complaint:"", bp:"", pulse:"", temp:"", spo2:"", priority:"ROUTINE" });
                  setShowTriageForm(false);
                  setToast("Patient triaged — doctor notified");
                  setTimeout(() => setToast(""), 3000);
                }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={triageForm.name} onChange={e=>setTriageForm(f=>({...f,name:e.target.value}))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Age</label><input required type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={triageForm.age} onChange={e=>setTriageForm(f=>({...f,age:e.target.value}))} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={triageForm.sex} onChange={e=>setTriageForm(f=>({...f,sex:e.target.value}))}>
                          <option value="M">Male</option><option value="F">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label><textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} value={triageForm.complaint} onChange={e=>setTriageForm(f=>({...f,complaint:e.target.value}))} /></div>
                  <div className="grid grid-cols-4 gap-2">
                    {[["BP","bp","120/80"],["Pulse","pulse","72"],["Temp","temp","37.0"],["SpO₂","spo2","98"]].map(([l,k,ph])=>(
                      <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={ph} value={(triageForm as Record<string,string>)[k]} onChange={e=>setTriageForm(f=>({...f,[k]:e.target.value}))} /></div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["ROUTINE","URGENT","CRITICAL"] as TriagePatient["priority"][]).map(p=>(
                        <button key={p} type="button" onClick={()=>setTriageForm(f=>({...f,priority:p}))}
                          className={`py-2 rounded-lg text-sm font-medium border ${triageForm.priority===p?(p==="CRITICAL"?"bg-red-600 text-white border-red-600":p==="URGENT"?"bg-orange-500 text-white border-orange-500":"bg-green-600 text-white border-green-600"):"bg-white text-gray-600 border-gray-300"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t">
                    <button type="button" onClick={()=>setShowTriageForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700">Submit Triage → Doctor</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[["CRITICAL",triageQueue.filter(t=>t.priority==="CRITICAL").length,"bg-red-50 border-red-100 text-red-700"],
              ["URGENT",triageQueue.filter(t=>t.priority==="URGENT").length,"bg-orange-50 border-orange-100 text-orange-700"],
              ["ROUTINE",triageQueue.filter(t=>t.priority==="ROUTINE").length,"bg-green-50 border-green-100 text-green-700"]].map(([p,c,cls])=>(
              <div key={p as string} className={`rounded-xl border p-3 text-center ${cls}`}><p className="text-2xl font-bold">{c as number}</p><p className="text-xs font-medium mt-0.5">{p as string}</p></div>
            ))}
          </div>

          <div className="space-y-3">
            {triageQueue.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border text-gray-400">Queue is empty</div>
            ) : triageQueue.map(t => (
              <div key={t.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${t.priority==="CRITICAL"?"border-red-500":t.priority==="URGENT"?"border-orange-500":"border-green-500"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge label={t.priority} color={t.priority==="CRITICAL"?"bg-red-100 text-red-700":t.priority==="URGENT"?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"} />
                      <span className="text-xs text-gray-400 font-mono">{t.id}</span>
                      <span className="text-xs text-gray-400">· {t.time}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{t.name} <span className="text-gray-400 font-normal text-sm">({t.age}y, {t.sex})</span></p>
                    <p className="text-sm text-gray-600 mt-0.5">{t.complaint}</p>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[["BP",t.bp,"mmHg"],["Pulse",String(t.pulse),"bpm"],["Temp",String(t.temp),"°C"],["SpO₂",String(t.spo2),"%"]].map(([k,v,u])=>(
                        <div key={k} className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-400">{k}</p>
                          <p className={`text-sm font-bold ${k==="SpO₂"&&Number(v)<95?"text-red-600":"text-gray-800"}`}>{v}<span className="text-xs font-normal text-gray-400 ml-0.5">{u}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge label={t.status} color={t.status==="Seen"?"bg-green-100 text-green-700":t.status==="Called"?"bg-blue-100 text-blue-700":"bg-yellow-100 text-yellow-700"} />
                    {t.status === "Waiting" && (
                      <button onClick={() => { updateTriagePatient(t.id, { status: "Called" }); setTriageQueue(getTriageQueue()); setToast("Patient called"); setTimeout(()=>setToast(""),2000); }}
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">Update Vitals</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "patients" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Patients</h2>
          {PATIENTS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold shrink-0">{p.name.charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><p className="font-semibold text-gray-900">{p.name}</p><Badge label={p.status} color={STATUS_COLORS[p.status]} /></div>
                  <p className="text-xs text-gray-500">{p.condition} · Ward: {p.ward} · Bed: {p.bed}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Doctor: {p.doctor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "medications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Medication Administration</h2>
            <p className="text-sm text-gray-500">{meds.filter(m => m.given).length}/{meds.length} given</p>
          </div>
          <div className="space-y-3">
            {meds.map((m, i) => (
              <div key={i} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${m.given ? "border-green-500" : "border-orange-400"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">{m.patient}</p>
                    <p className="font-semibold text-gray-900">{m.drug}</p>
                    <p className="text-sm text-gray-600">{m.dose} · {m.route}</p>
                    <p className="text-xs text-gray-400 mt-1">⏰ {m.time}</p>
                  </div>
                  <button onClick={() => toggleMed(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${m.given ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}>
                    {m.given ? "✓ Given" : "Mark Given"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "care" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Care Plans</h2>
          {PATIENTS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
              <p className="font-semibold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-500 mb-3">{p.condition}</p>
              <div className="space-y-2">
                {["Monitor vitals every 4 hours", "Administer prescribed medications on schedule", "Ensure adequate fluid intake", "Document any changes in condition", "Patient education on discharge plan"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "handover" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Shift Handover Report</h2>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div><p className="font-semibold text-gray-900">Morning Shift → Afternoon Shift</p><p className="text-xs text-gray-400">Handover time: 15:00</p></div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Submit Handover</button>
            </div>
            {PATIENTS.map(p => (
              <div key={p.id} className="border-b last:border-0 py-3">
                <div className="flex items-center gap-2 mb-1"><p className="font-medium text-gray-900">{p.name}</p><Badge label={p.status} color={STATUS_COLORS[p.status]} /></div>
                <p className="text-xs text-gray-500">Bed {p.bed} · {p.condition}</p>
                <p className="text-xs text-gray-600 mt-1">BP: {p.bp} · Pulse: {p.pulse} · Temp: {p.temp}°C · SpO₂: {p.spo2}%</p>
                <p className="text-xs text-gray-400 mt-1">Medications administered as scheduled. No acute changes noted.</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400 border"><div className="text-4xl mb-3">📅</div><p className="font-medium text-gray-600">Schedule</p></div>
      )}
      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
