"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",     label: "Overview",       icon: "🤝" },
  { id: "patients",     label: "My Patients",    icon: "🏥" },
  { id: "appointments", label: "Appointments",   icon: "📅" },
  { id: "medications",  label: "Medications",    icon: "💊" },
  { id: "updates",      label: "Health Updates", icon: "📋" },
  { id: "messages",     label: "Messages",       icon: "💬" },
  { id: "profile",      label: "My Profile",     icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const PATIENTS = [
  { id:"P-001", name:"John Doe",     age:39, condition:"Hypertension",    doctor:"Dr. Sarah Johnson", status:"Stable",    nextVisit:"Apr 5, 2026",  phone:"0733333333" },
  { id:"P-002", name:"Mary Wanjiku", age:25, condition:"Type 2 Diabetes", doctor:"Dr. Peter Kamau",   status:"Monitoring",nextVisit:"Apr 8, 2026",  phone:"0755000002" },
];

const APPOINTMENTS = [
  { patient:"John Doe",     doctor:"Dr. Sarah Johnson", date:"Apr 5, 2026",  time:"10:00 AM", reason:"Cardiology Review",  status:"CONFIRMED" },
  { patient:"Mary Wanjiku", doctor:"Dr. Peter Kamau",   date:"Apr 8, 2026",  time:"09:00 AM", reason:"Diabetes Follow-up", status:"CONFIRMED" },
  { patient:"John Doe",     doctor:"Dr. Sarah Johnson", date:"Mar 20, 2026", time:"11:00 AM", reason:"BP Check",           status:"COMPLETED" },
];

const MEDICATIONS = [
  { patient:"John Doe",     drug:"Amlodipine 5mg",  dose:"Once daily (morning)",  time:"08:00 AM", given:true,  notes:"With water" },
  { patient:"John Doe",     drug:"Aspirin 75mg",    dose:"Once daily",             time:"08:00 AM", given:true,  notes:"After breakfast" },
  { patient:"Mary Wanjiku", drug:"Metformin 500mg", dose:"Twice daily with meals", time:"07:30 AM", given:false, notes:"Before breakfast" },
  { patient:"Mary Wanjiku", drug:"Metformin 500mg", dose:"Twice daily with meals", time:"06:30 PM", given:false, notes:"Before dinner" },
];

const UPDATES = [
  { patient:"John Doe",     date:"Apr 4, 2026", type:"Vital Signs",   content:"BP: 138/88 mmHg · Pulse: 76 bpm · Temp: 36.8°C · SpO₂: 98%", by:"Dr. Sarah Johnson" },
  { patient:"Mary Wanjiku", date:"Apr 3, 2026", type:"Lab Result",    content:"Fasting Blood Sugar: 7.2 mmol/L (slightly elevated). Continue Metformin.", by:"Dr. Peter Kamau" },
  { patient:"John Doe",     date:"Apr 2, 2026", type:"Doctor Note",   content:"Patient responding well to Amlodipine. Continue current dose. Reduce salt intake.", by:"Dr. Sarah Johnson" },
  { patient:"Mary Wanjiku", date:"Apr 1, 2026", type:"Appointment",   content:"Next appointment scheduled for Apr 8, 2026 at 09:00 AM.", by:"System" },
];

export default function CaregiverDashboard() {
  const [tab, setTab] = useState("overview");
  const [medications, setMedications] = useState(MEDICATIONS);

  const toggleGiven = (idx: number) => setMedications(m => m.map((x, i) => i === idx ? { ...x, given: !x.given } : x));

  const UPDATE_COLORS: Record<string,string> = { "Vital Signs":"bg-blue-100 text-blue-700", "Lab Result":"bg-yellow-100 text-yellow-700", "Doctor Note":"bg-green-100 text-green-700", "Appointment":"bg-purple-100 text-purple-700" };

  return (
    <DashboardShell title="Caregiver Portal" role="Caregiver" accentColor="bg-orange-600" icon="🤝" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Care Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Patients in Care" value="2" icon="🏥" color="bg-orange-500" />
            <StatCard label="Upcoming Visits" value="2" icon="📅" color="bg-blue-600" />
            <StatCard label="Medications Due Today" value={String(medications.filter(m=>!m.given).length)} icon="💊" color="bg-purple-600" />
            <StatCard label="New Updates" value="2" icon="📋" color="bg-green-600" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["My Patients","patients","🏥","bg-orange-50 border-orange-100 text-orange-700"],["Appointments","appointments","📅","bg-blue-50 border-blue-100 text-blue-700"],["Medications","medications","💊","bg-purple-50 border-purple-100 text-purple-700"],["Health Updates","updates","📋","bg-green-50 border-green-100 text-green-700"]].map(([label,id,icon,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Patients Under Care</h3>
            {PATIENTS.map(p=>(
              <div key={p.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">{p.name.charAt(0)}</div>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.condition} · Next visit: {p.nextVisit}</p></div>
                <Badge label={p.status} color={p.status==="Stable"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "patients" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Patients</h2>
          {PATIENTS.map(p=>(
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-lg shrink-0">{p.name.charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <Badge label={p.status} color={p.status==="Stable"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                    {[["Age",`${p.age} years`],["Condition",p.condition],["Doctor",p.doctor],["Phone",p.phone]].map(([k,v])=>(
                      <div key={k} className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">{k}</p><p className="font-medium text-gray-800 mt-0.5">{v}</p></div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">📅 Next visit: {p.nextVisit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "appointments" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Appointments</h2>
          <div className="space-y-3">
            {APPOINTMENTS.map((a,i)=>(
              <div key={i} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={a.status} color={a.status==="CONFIRMED"?"bg-green-100 text-green-700":a.status==="COMPLETED"?"bg-blue-100 text-blue-700":"bg-yellow-100 text-yellow-700"} />
                    </div>
                    <p className="font-semibold text-gray-900">{a.patient}</p>
                    <p className="text-sm text-gray-600">{a.doctor} · {a.reason}</p>
                    <p className="text-sm font-medium text-blue-700 mt-1">📅 {a.date} · {a.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "medications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Medication Schedule</h2>
            <p className="text-sm text-gray-500">{medications.filter(m=>m.given).length}/{medications.length} given today</p>
          </div>
          <div className="space-y-3">
            {medications.map((m,i)=>(
              <div key={i} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${m.given?"border-green-500":"border-orange-400"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">{m.patient}</p>
                    <p className="font-semibold text-gray-900">{m.drug}</p>
                    <p className="text-sm text-gray-600">{m.dose}</p>
                    <p className="text-xs text-gray-400 mt-1">⏰ {m.time} · {m.notes}</p>
                  </div>
                  <button onClick={() => toggleGiven(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${m.given?"bg-green-100 text-green-700 hover:bg-green-200":"bg-orange-100 text-orange-700 hover:bg-orange-200"}`}>
                    {m.given ? "✓ Given" : "Mark Given"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "updates" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Health Updates</h2>
          <div className="space-y-3">
            {UPDATES.map((u,i)=>(
              <div key={i} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <Badge label={u.type} color={UPDATE_COLORS[u.type]||"bg-gray-100 text-gray-700"} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{u.patient}</p>
                      <p className="text-xs text-gray-400">{u.date}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{u.content}</p>
                    <p className="text-xs text-gray-400 mt-1">By: {u.by}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-gray-400">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium text-gray-600">Messages</p>
          <p className="text-sm mt-1">Secure messaging with care team coming soon.</p>
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
