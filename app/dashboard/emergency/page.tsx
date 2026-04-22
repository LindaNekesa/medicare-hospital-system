"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",   label: "Overview",         icon: "📊" },
  { id: "incidents",  label: "Active Incidents",  icon: "🚨" },
  { id: "triage",     label: "Triage",            icon: "🏥" },
  { id: "equipment",  label: "Equipment Check",   icon: "🔧" },
  { id: "protocols",  label: "Protocols",         icon: "📋" },
  { id: "profile",    label: "My Profile",        icon: "👤" },
];

const INCIDENTS = [
  { id:"INC-001", type:"RTA",           patient:"Unknown Male",  location:"Mombasa Rd",    priority:"CRITICAL", status:"En Route",  eta:"5 min",  vitals:"BP 80/50, Pulse 120, GCS 10" },
  { id:"INC-002", type:"Cardiac Arrest",patient:"John Mwangi",   location:"CBD",           priority:"CRITICAL", status:"On Scene",  eta:"—",      vitals:"No pulse, CPR in progress" },
  { id:"INC-003", type:"Burns",         patient:"Female, ~30yrs",location:"Industrial Area",priority:"URGENT",   status:"Returning", eta:"12 min", vitals:"BP 100/70, Pulse 98, Burns 30% BSA" },
];

export default function EmergencyDashboard() {
  const [tab, setTab] = useState("overview");
  const [incidents, setIncidents] = useState(INCIDENTS);

  const PRIORITY_COLORS: Record<string,string> = { CRITICAL:"bg-red-100 text-red-700", URGENT:"bg-orange-100 text-orange-700", ROUTINE:"bg-green-100 text-green-700" };
  const STATUS_COLORS: Record<string,string> = { "En Route":"bg-blue-100 text-blue-700", "On Scene":"bg-red-100 text-red-700", "Returning":"bg-yellow-100 text-yellow-700", "Completed":"bg-green-100 text-green-700" };

  return (
    <DashboardShell title="Emergency Portal" role="Paramedic / EMT" accentColor="bg-red-700" icon="🚑" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Emergency Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Active Incidents",incidents.filter(i=>i.status!=="Completed").length,"bg-red-600","🚨"],
              ["Critical",incidents.filter(i=>i.priority==="CRITICAL").length,"bg-red-800","⚠️"],
              ["Ambulances",3,"bg-blue-600","🚑"],
              ["Avg Response","8 min","bg-green-600","⏱️"]].map(([l,v,c,i])=>(
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Paramedic / EMT Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[["🚨 Emergency Response","Respond rapidly to emergency calls"],
                ["🩺 Pre-hospital Care","Assess and stabilise patients at scene"],
                ["💉 Advanced Life Support","Administer medications, IV access, intubation"],
                ["🚑 Patient Transport","Safe transport to appropriate facility"],
                ["📋 Documentation","Accurate pre-hospital care records"],
                ["🔧 Equipment Maintenance","Daily checks on ambulance equipment"],
                ["📞 Hospital Notification","Pre-alert receiving hospital of incoming patient"],
                ["🤝 Handover","Structured handover to A&E team"]].map(([t,d])=>(
                <div key={t as string} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="shrink-0">{(t as string).split(" ")[0]}</span>
                  <div><p className="font-medium text-gray-800 text-xs">{(t as string).slice(3)}</p><p className="text-xs text-gray-500">{d as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "incidents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Active Incidents</h2>
            <button onClick={() => setIncidents(i => [...i, {id:`INC-${String(i.length+1).padStart(3,"0")}`,type:"New Call",patient:"Unknown",location:"TBC",priority:"URGENT",status:"En Route",eta:"10 min",vitals:"Assessing"}])}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">+ New Incident</button>
          </div>
          <div className="space-y-3">
            {incidents.map(inc=>(
              <div key={inc.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${inc.priority==="CRITICAL"?"border-red-600":"border-orange-500"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${PRIORITY_COLORS[inc.priority]}`}>{inc.priority}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inc.status]}`}>{inc.status}</span>
                      <span className="text-xs text-gray-400 font-mono">{inc.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{inc.type}</p>
                    <p className="text-sm text-gray-600">{inc.patient} · {inc.location}</p>
                    <p className="text-xs text-gray-500 mt-1">Vitals: {inc.vitals}</p>
                    {inc.eta !== "—" && <p className="text-xs text-blue-600 font-medium mt-0.5">ETA: {inc.eta}</p>}
                  </div>
                  <button onClick={() => setIncidents(prev => prev.map(x => x.id===inc.id ? {...x,status:"Completed"} : x))}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium shrink-0">Complete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "triage" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">START Triage System</h2>
          <div className="grid grid-cols-2 gap-3">
            {[["🔴 IMMEDIATE","Life-threatening — treat first","bg-red-50 border-red-200 text-red-700"],
              ["🟡 DELAYED","Serious but stable","bg-yellow-50 border-yellow-200 text-yellow-700"],
              ["🟢 MINOR","Walking wounded","bg-green-50 border-green-200 text-green-700"],
              ["⚫ EXPECTANT","Unsurvivable injuries","bg-gray-50 border-gray-200 text-gray-700"]].map(([l,d,c])=>(
              <div key={l as string} className={`rounded-xl border p-4 ${c}`}>
                <p className="font-bold text-sm">{l as string}</p>
                <p className="text-xs mt-1 opacity-80">{d as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "equipment" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Daily Equipment Check</h2>
          <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
            {[["Defibrillator (AED)","Charged, pads attached","✅"],["Oxygen Cylinder","Full (200 bar)","✅"],["IV Supplies","Stocked","✅"],["Medications Box","All drugs present","✅"],["Stretcher","Functional","✅"],["Suction Unit","Working","✅"],["Spinal Board","Present","✅"],["Radio/Communication","Tested","✅"]].map(([item,note,status])=>(
              <div key={item as string} className="flex items-center justify-between py-2 border-b last:border-0">
                <div><p className="text-sm font-medium text-gray-900">{item as string}</p><p className="text-xs text-gray-400">{note as string}</p></div>
                <span className="text-green-600 font-bold">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "protocols" && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Emergency Protocols</h2>
          {[["Cardiac Arrest","CPR 30:2, AED, IV access, Adrenaline 1mg IV every 3-5 min"],
            ["Anaphylaxis","Adrenaline 0.5mg IM, Oxygen, IV fluids, Antihistamine"],
            ["Stroke","FAST assessment, O2 if SpO2 <94%, IV access, rapid transport"],
            ["Major Trauma","ABCDE approach, haemorrhage control, spinal precautions"],
            ["Hypoglycaemia","Glucose 10% IV or oral glucose if conscious"]].map(([title,steps])=>(
            <div key={title as string} className="bg-white rounded-xl border shadow-sm p-4">
              <p className="font-semibold text-red-700">{title as string}</p>
              <p className="text-sm text-gray-600 mt-1">{steps as string}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
