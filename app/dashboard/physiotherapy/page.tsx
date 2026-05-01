"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";
import { getReferralsByDepartment, updateReferral, Referral } from "@/lib/referralStore";

const NAV = [
  { id: "overview",    label: "Overview",          icon: "📊" },
  { id: "referrals",   label: "Referrals",         icon: "🔗" },
  { id: "referrals_in",label: "Incoming Requests", icon: "📥" },
  { id: "assessment",  label: "Assessment",        icon: "🩺" },
  { id: "treatment",   label: "Treatment Plans",   icon: "💪" },
  { id: "progress",    label: "Progress Notes",    icon: "📈" },
  { id: "equipment",   label: "Equipment",         icon: "🔧" },
  { id: "profile",     label: "My Profile",        icon: "👤" },
];

const PATIENTS = [
  { id:"P-001", name:"Peter Mwangi",  condition:"Post-op Knee Replacement", sessions:8,  goal:"Full ROM restoration",    status:"Active",   nextSession:"Apr 9, 2026 10:00" },
  { id:"P-002", name:"Grace Otieno",  condition:"Lower Back Pain",          sessions:4,  goal:"Pain reduction, mobility", status:"Active",   nextSession:"Apr 9, 2026 11:00" },
  { id:"P-003", name:"James Kariuki", condition:"Stroke Rehabilitation",    sessions:15, goal:"Gait retraining",          status:"Ongoing",  nextSession:"Apr 10, 2026 09:00" },
];

export default function PhysiotherapyDashboard() {
  const [tab, setTab] = useState("overview");
  const [incomingReferrals, setIncomingReferrals] = useState<Referral[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = () => setIncomingReferrals(getReferralsByDepartment("PHYSIOTHERAPY"));
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const acceptRef = (id: string) => { updateReferral(id, { status: "ACCEPTED" }); setIncomingReferrals(getReferralsByDepartment("PHYSIOTHERAPY")); setToast("Referral accepted"); setTimeout(()=>setToast(""),2500); };
  const completeRef = (id: string) => { updateReferral(id, { status: "COMPLETED", response: "Physiotherapy session completed. Home exercise program provided.", respondedAt: new Date().toLocaleString() }); setIncomingReferrals(getReferralsByDepartment("PHYSIOTHERAPY")); setToast("Referral completed"); setTimeout(()=>setToast(""),2500); };

  return (
    <DashboardShell title="Physiotherapy" role="Physiotherapist" accentColor="bg-teal-700" icon="💪" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {tab === "referrals_in" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-gray-900">Incoming Referrals</h2><p className="text-sm text-gray-500 mt-0.5">From doctors · Auto-updates every 3s</p></div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">{incomingReferrals.filter(r=>r.status==="PENDING").length} Pending</span>
          </div>
          {incomingReferrals.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border text-gray-400"><div className="text-4xl mb-3">🔗</div><p>No referrals yet</p></div>
          ) : incomingReferrals.map(r => (
            <div key={r.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${r.urgency==="STAT"?"border-red-500":r.urgency==="URGENT"?"border-orange-500":"border-teal-400"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.urgency==="STAT"?"bg-red-100 text-red-700":r.urgency==="URGENT"?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>{r.urgency}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status==="PENDING"?"bg-yellow-100 text-yellow-700":r.status==="COMPLETED"?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"}`}>{r.status}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{r.patientName}</p>
                  <p className="text-sm text-teal-700">{r.reason}</p>
                  <p className="text-xs text-gray-500 mt-1 italic">{r.clinicalNotes}</p>
                  <p className="text-xs text-gray-400 mt-0.5">From: {r.fromDoctor} · {r.sentAt}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {r.status === "PENDING" && <button onClick={() => acceptRef(r.id)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">Accept</button>}
                  {(r.status === "ACCEPTED" || r.status === "IN_PROGRESS") && <button onClick={() => completeRef(r.id)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">Complete</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Physiotherapy Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Active Patients",PATIENTS.length,"bg-teal-600","💪"],["Sessions Today",6,"bg-blue-600","📅"],["New Referrals",2,"bg-yellow-500","📥"],["Completed Goals",3,"bg-green-600","✅"]].map(([l,v,c,i])=>(
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Physiotherapist Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[["🩺 Patient Assessment","Assess musculoskeletal and neurological function"],
                ["💪 Exercise Therapy","Design and supervise therapeutic exercise programs"],
                ["🤲 Manual Therapy","Joint mobilisation, soft tissue techniques"],
                ["📋 Treatment Planning","Develop individualised rehabilitation plans"],
                ["📈 Progress Monitoring","Track and document patient progress"],
                ["🏃 Gait Training","Assist patients in relearning to walk"],
                ["💬 Patient Education","Teach home exercise programs"],
                ["🔧 Equipment","Prescribe mobility aids and orthotics"]].map(([t,d])=>(
                <div key={t as string} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="shrink-0">{(t as string).split(" ")[0]}</span>
                  <div><p className="font-medium text-gray-800 text-xs">{(t as string).slice(3)}</p><p className="text-xs text-gray-500">{d as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "referrals" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Physiotherapy Referrals</h2>
          <div className="space-y-3">
            {[{patient:"Ali Hassan",condition:"Post-cardiac surgery mobility",doctor:"Dr. Sarah Johnson",date:"Apr 8, 2026",urgency:"URGENT"},
              {patient:"Mary Wanjiku",condition:"Antenatal pelvic floor exercises",doctor:"Dr. Achieng Otieno",date:"Apr 8, 2026",urgency:"ROUTINE"}].map(r=>(
              <div key={r.patient} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${r.urgency==="URGENT"?"border-orange-500":"border-teal-400"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.urgency==="URGENT"?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>{r.urgency}</span>
                    <p className="font-semibold text-gray-900 mt-1">{r.patient}</p>
                    <p className="text-sm text-teal-700">{r.condition}</p>
                    <p className="text-xs text-gray-500 mt-1">From: {r.doctor} · {r.date}</p>
                  </div>
                  <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 font-medium shrink-0">Accept</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "treatment" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Treatment Plans</h2>
          {PATIENTS.map(p=>(
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-sm text-teal-700">{p.condition}</p>
                  <p className="text-xs text-gray-500 mt-1">Goal: {p.goal}</p>
                  <p className="text-xs text-gray-400">Sessions completed: {p.sessions} · Next: {p.nextSession}</p>
                  <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{width:`${Math.min((p.sessions/20)*100,100)}%`}} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{p.sessions}/20 sessions</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${p.status==="Active"?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "assessment" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Patient Assessment</h2>
          {PATIENTS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-sm text-teal-700">{p.condition}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {[["Pain Score", "4/10"], ["ROM", "65%"], ["Strength", "3/5"], ["Mobility", "Assisted"]].map(([k, v]) => (
                      <div key={k} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-gray-400">{k}</p>
                        <p className="font-semibold text-gray-800">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 font-medium shrink-0">Update Assessment</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "progress" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Progress Notes</h2>
          {PATIENTS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-4">
              <p className="font-semibold text-gray-900">{p.name}</p>
              <p className="text-sm text-teal-700 mb-2">{p.condition}</p>
              <div className="space-y-2">
                {[{ date: "Apr 20, 2026", note: "Patient showing improved ROM. Pain reduced from 6/10 to 4/10. Progressed to active exercises." },
                  { date: "Apr 15, 2026", note: "Initial session. Baseline assessment completed. Passive ROM exercises commenced." }].map(n => (
                  <div key={n.date} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 font-medium">{n.date}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{n.note}</p>
                  </div>
                ))}
              </div>
              <button className="mt-2 text-xs bg-teal-100 text-teal-700 hover:bg-teal-200 px-3 py-1.5 rounded-lg font-medium">+ Add Note</button>
            </div>
          ))}
        </div>
      )}
      {tab === "equipment" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Equipment Management</h2>
          <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
            {[["Parallel Bars", "Good condition", "✅"], ["Treadmill", "Serviced Apr 1, 2026", "✅"], ["Exercise Bike", "Needs calibration", "⚠️"], ["Ultrasound Therapy Unit", "Operational", "✅"], ["TENS Machine", "Battery low", "⚠️"], ["Resistance Bands (Set)", "Stocked", "✅"], ["Balance Board", "Good condition", "✅"], ["Hydrotherapy Pool", "Operational", "✅"]].map(([item, note, status]) => (
              <div key={item as string} className="flex items-center justify-between py-2 border-b last:border-0">
                <div><p className="text-sm font-medium text-gray-900">{item as string}</p><p className="text-xs text-gray-400">{note as string}</p></div>
                <span className={`font-bold ${status === "✅" ? "text-green-600" : "text-yellow-500"}`}>{status as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
