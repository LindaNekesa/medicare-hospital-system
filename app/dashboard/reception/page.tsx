"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";
import { appointments, notifications } from "@/lib/store";

const NAV = [
  { id: "overview",      label: "Overview",          icon: "📊" },
  { id: "registration",  label: "Patient Registration",icon: "📝" },
  { id: "appointments",  label: "Appointments",       icon: "📅" },
  { id: "queue",         label: "Waiting Queue",      icon: "🏥" },
  { id: "billing",       label: "Billing",            icon: "💰" },
  { id: "profile",       label: "My Profile",         icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

export default function ReceptionDashboard() {
  const [tab, setTab] = useState("overview");
  const [queue, setQueue] = useState([
    { id:"Q-001", name:"John Doe",     reason:"Appointment",    time:"09:00", status:"Waiting",  doctor:"Dr. Sarah Johnson" },
    { id:"Q-002", name:"Grace Otieno", reason:"Walk-in",        time:"09:15", status:"With Doctor",doctor:"Dr. Peter Kamau" },
    { id:"Q-003", name:"Ali Hassan",   reason:"Follow-up",      time:"09:30", status:"Waiting",  doctor:"Dr. Sarah Johnson" },
    { id:"Q-004", name:"Mary Wanjiku", reason:"Antenatal",      time:"09:45", status:"Waiting",  doctor:"Dr. Achieng Otieno" },
  ]);
  const [regForm, setRegForm] = useState({ firstName:"", lastName:"", dob:"", gender:"MALE", phone:"", email:"", address:"", insurance:"" });
  const [toast, setToast] = useState("");

  const callNext = (id: string) => {
    setQueue(q => q.map(x => x.id===id ? {...x,status:"Called"} : x));
    setToast("Patient called");
    setTimeout(() => setToast(""), 2000);
  };

  const STATUS_COLORS: Record<string,string> = { Waiting:"bg-yellow-100 text-yellow-700", "With Doctor":"bg-blue-100 text-blue-700", Called:"bg-green-100 text-green-700", Done:"bg-gray-100 text-gray-600" };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(`Patient ${regForm.firstName} ${regForm.lastName} registered successfully`);
    setRegForm({ firstName:"", lastName:"", dob:"", gender:"MALE", phone:"", email:"", address:"", insurance:"" });
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <DashboardShell title="Reception" role="Receptionist" accentColor="bg-sky-700" icon="🏥" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Reception Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Waiting",queue.filter(q=>q.status==="Waiting").length,"bg-yellow-500","⏳"],
              ["With Doctor",queue.filter(q=>q.status==="With Doctor").length,"bg-blue-600","🩺"],
              ["Appointments Today",8,"bg-green-600","📅"],
              ["Walk-ins Today",3,"bg-purple-600","🚶"]].map(([l,v,c,i])=>(
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[["Register Patient","registration","📝","bg-blue-50 border-blue-100 text-blue-700"],
              ["Appointments","appointments","📅","bg-green-50 border-green-100 text-green-700"],
              ["Waiting Queue","queue","🏥","bg-yellow-50 border-yellow-100 text-yellow-700"]].map(([l,id,ic,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{ic}</div>
                <p className="font-semibold text-sm">{l as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "registration" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900">Register New Patient</h2>
          <form onSubmit={handleRegister} className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name *"><input required className={inputCls} value={regForm.firstName} onChange={e=>setRegForm(f=>({...f,firstName:e.target.value}))} /></Field>
              <Field label="Last Name *"><input required className={inputCls} value={regForm.lastName} onChange={e=>setRegForm(f=>({...f,lastName:e.target.value}))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth *"><input required type="date" className={inputCls} value={regForm.dob} onChange={e=>setRegForm(f=>({...f,dob:e.target.value}))} /></Field>
              <Field label="Gender">
                <select className={inputCls} value={regForm.gender} onChange={e=>setRegForm(f=>({...f,gender:e.target.value}))}>
                  <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone *"><input required className={inputCls} value={regForm.phone} onChange={e=>setRegForm(f=>({...f,phone:e.target.value}))} placeholder="0700000000" /></Field>
              <Field label="Email"><input type="email" className={inputCls} value={regForm.email} onChange={e=>setRegForm(f=>({...f,email:e.target.value}))} /></Field>
            </div>
            <Field label="Address"><input className={inputCls} value={regForm.address} onChange={e=>setRegForm(f=>({...f,address:e.target.value}))} /></Field>
            <Field label="Insurance Provider"><input className={inputCls} value={regForm.insurance} onChange={e=>setRegForm(f=>({...f,insurance:e.target.value}))} placeholder="e.g. NHIF, AAR" /></Field>
            <button type="submit" className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-sky-700">Register Patient</button>
          </form>
        </div>
      )}

      {tab === "appointments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Today&apos;s Appointments</h2>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700">+ Book Appointment</button>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Time","Patient","Doctor","Reason","Status"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {queue.map(q=>(
                  <tr key={q.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{q.time}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{q.name}</td>
                    <td className="px-4 py-3 text-gray-600">{q.doctor}</td>
                    <td className="px-4 py-3 text-gray-500">{q.reason}</td>
                    <td className="px-4 py-3"><Badge label={q.status} color={STATUS_COLORS[q.status]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "queue" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Waiting Queue</h2>
          <div className="space-y-3">
            {queue.filter(q=>q.status!=="Done").map(q=>(
              <div key={q.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${q.status==="With Doctor"?"border-blue-500":q.status==="Called"?"border-green-500":"border-yellow-400"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={q.status} color={STATUS_COLORS[q.status]} />
                      <span className="text-xs text-gray-400 font-mono">{q.time}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{q.name}</p>
                    <p className="text-xs text-gray-500">{q.reason} · {q.doctor}</p>
                  </div>
                  {q.status === "Waiting" && (
                    <button onClick={() => callNext(q.id)} className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 font-medium shrink-0">Call Patient</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "billing" && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400 border"><div className="text-4xl mb-3">💰</div><p className="font-medium text-gray-600">Billing & Payments</p></div>
      )}
      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
