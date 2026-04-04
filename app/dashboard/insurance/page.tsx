"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import UserProfile from "@/components/profile/UserProfile";
import { insuranceMembers, InsuranceMember } from "@/lib/store";

const NAV = [
  { id: "overview", label: "Overview",          icon: "📊" },
  { id: "claims",   label: "Claims",            icon: "📄" },
  { id: "members",  label: "Members",           icon: "👥" },
  { id: "preauth",  label: "Pre-Authorization", icon: "✅" },
  { id: "billing",  label: "Billing",           icon: "💰" },
  { id: "reports",  label: "Reports",           icon: "📈" },
  { id: "profile",  label: "My Profile",        icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-500 w-28 shrink-0 text-right">{label}</span>
    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${(value/max)*100}%` }} />
    </div>
    <span className="text-xs font-semibold text-gray-700 w-12">{value}</span>
  </div>
);

const CLAIMS = [
  { id:"CLM-001", member:"John Doe",     facility:"Medicare Hospital", type:"Consultation",  amount:"KES 12,000", date:"Apr 1, 2026",  status:"PENDING" },
  { id:"CLM-002", member:"Jane Smith",   facility:"City Clinic",       type:"Lab Tests",     amount:"KES 8,500",  date:"Mar 30, 2026", status:"APPROVED" },
  { id:"CLM-003", member:"Ali Hassan",   facility:"Medicare Hospital", type:"Surgery",       amount:"KES 45,000", date:"Mar 28, 2026", status:"UNDER REVIEW" },
  { id:"CLM-004", member:"Mary Wanjiku", facility:"Medicare Hospital", type:"Maternity",     amount:"KES 28,000", date:"Mar 25, 2026", status:"APPROVED" },
  { id:"CLM-005", member:"Peter Mwangi", facility:"Westlands Medical", type:"Physiotherapy", amount:"KES 6,000",  date:"Mar 20, 2026", status:"REJECTED" },
];

const MEMBERS = [
  { id:"MBR-001", name:"John Doe",     plan:"Gold",   premium:"KES 4,500/mo", since:"Jan 2024", status:"Active",    dependants:2 },
  { id:"MBR-002", name:"Jane Smith",   plan:"Silver", premium:"KES 2,800/mo", since:"Mar 2023", status:"Active",    dependants:1 },
  { id:"MBR-003", name:"Ali Hassan",   plan:"Gold",   premium:"KES 4,500/mo", since:"Jun 2022", status:"Active",    dependants:3 },
  { id:"MBR-004", name:"Mary Wanjiku", plan:"Bronze", premium:"KES 1,500/mo", since:"Sep 2024", status:"Active",    dependants:0 },
  { id:"MBR-005", name:"Peter Mwangi", plan:"Silver", premium:"KES 2,800/mo", since:"Jan 2023", status:"Suspended", dependants:2 },
];

const PREAUTHS = [
  { id:"PA-001", member:"Ali Hassan",   procedure:"Knee Replacement Surgery",  facility:"Medicare Hospital", amount:"KES 120,000", date:"Apr 2, 2026",  status:"APPROVED" },
  { id:"PA-002", member:"John Doe",     procedure:"Cardiac Catheterisation",   facility:"Medicare Hospital", amount:"KES 85,000",  date:"Apr 3, 2026",  status:"PENDING" },
  { id:"PA-003", member:"Jane Smith",   procedure:"MRI Brain Scan",            facility:"Westlands Medical", amount:"KES 18,000",  date:"Apr 4, 2026",  status:"PENDING" },
  { id:"PA-004", member:"Mary Wanjiku", procedure:"Caesarean Section",         facility:"Medicare Hospital", amount:"KES 45,000",  date:"Mar 30, 2026", status:"APPROVED" },
];

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

function MembersTab() {
  const [members, setMembers] = useState<InsuranceMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name:"", email:"", plan:"Silver", premium:2800, since:new Date().toISOString().slice(0,10), status:"Active", dependants:0 });

  useEffect(() => { setMembers(insuranceMembers.getAll()); }, []);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    insuranceMembers.add(form);
    setMembers(insuranceMembers.getAll());
    setForm({ name:"", email:"", plan:"Silver", premium:2800, since:new Date().toISOString().slice(0,10), status:"Active", dependants:0 });
    setShowForm(false);
    setToast("Member enrolled successfully");
    setTimeout(() => setToast(""), 3000);
  };

  const suspend = (id: string) => { insuranceMembers.update(id, { status:"Suspended" }); setMembers(insuranceMembers.getAll()); };
  const activate = (id: string) => { insuranceMembers.update(id, { status:"Active" }); setMembers(insuranceMembers.getAll()); };

  const PLAN_COLORS: Record<string,string> = { Gold:"bg-yellow-100 text-yellow-700", Silver:"bg-gray-100 text-gray-700", Bronze:"bg-orange-100 text-orange-700" };

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Enroll New Member</h3>
            <form onSubmit={add} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name"><input required className={inputCls} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></Field>
                <Field label="Email"><input required type="email" className={inputCls} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Plan">
                  <select className={inputCls} value={form.plan} onChange={e=>setForm(f=>({...f,plan:e.target.value}))}>
                    {["Bronze","Silver","Gold"].map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Monthly Premium (KES)"><input required type="number" className={inputCls} value={form.premium} onChange={e=>setForm(f=>({...f,premium:Number(e.target.value)}))} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start Date"><input required type="date" className={inputCls} value={form.since} onChange={e=>setForm(f=>({...f,since:e.target.value}))} /></Field>
                <Field label="Dependants"><input type="number" min="0" className={inputCls} value={form.dependants} onChange={e=>setForm(f=>({...f,dependants:Number(e.target.value)}))} /></Field>
              </div>
              <div className="flex gap-3 pt-2 border-t">
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700">Enroll Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Members <span className="text-sm font-normal text-gray-400">({members.length})</span></h2>
        <button onClick={() => setShowForm(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700">+ Enroll Member</button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead><tr className="bg-gray-50 border-b">{["ID","Name","Plan","Premium","Since","Dependants","Status","Action"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody>
            {members.map(m=>(
              <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{m.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3"><Badge label={m.plan} color={PLAN_COLORS[m.plan]||"bg-gray-100 text-gray-700"} /></td>
                <td className="px-4 py-3 text-gray-600">KES {m.premium.toLocaleString()}/mo</td>
                <td className="px-4 py-3 text-gray-500">{m.since}</td>
                <td className="px-4 py-3 text-gray-600">{m.dependants}</td>
                <td className="px-4 py-3"><Badge label={m.status} color={m.status==="Active"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"} /></td>
                <td className="px-4 py-3">
                  {m.status === "Active" ? <button onClick={() => suspend(m.id)} className="text-xs text-red-500 hover:underline">Suspend</button>
                    : <button onClick={() => activate(m.id)} className="text-xs text-green-600 hover:underline">Activate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function InsuranceDashboard() {
  const [tab, setTab] = useState("overview");
  const [claims, setClaims] = useState(CLAIMS);

  const updateClaim = (id: string, status: string) => setClaims(c => c.map(x => x.id === id ? { ...x, status } : x));

  const CLAIM_COLORS: Record<string,string> = { APPROVED:"bg-green-100 text-green-700", PENDING:"bg-yellow-100 text-yellow-700", "UNDER REVIEW":"bg-blue-100 text-blue-700", REJECTED:"bg-red-100 text-red-700" };
  const PLAN_COLORS: Record<string,string> = { Gold:"bg-yellow-100 text-yellow-700", Silver:"bg-gray-100 text-gray-700", Bronze:"bg-orange-100 text-orange-700" };

  return (
    <DashboardShell title="Insurance Portal" role="Insurance Company" accentColor="bg-pink-700" icon="🛡️" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Insurance Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Active Members" value="3,420" icon="👥" color="bg-pink-600" />
            <StatCard label="Pending Claims" value={String(claims.filter(c=>c.status==="PENDING").length)} icon="📄" color="bg-orange-500" />
            <StatCard label="Approved This Month" value="128" icon="✅" color="bg-green-600" />
            <StatCard label="Total Paid Out" value="KES 1.2M" icon="💰" color="bg-blue-600" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Claims","claims","📄","bg-orange-50 border-orange-100 text-orange-700"],["Members","members","👥","bg-pink-50 border-pink-100 text-pink-700"],["Pre-Auth","preauth","✅","bg-green-50 border-green-100 text-green-700"],["Reports","reports","📈","bg-blue-50 border-blue-100 text-blue-700"]].map(([label,id,icon,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Claims</h3>
            {claims.slice(0,3).map(c=>(
              <div key={c.id} className="flex items-center gap-4 py-2.5 border-b last:border-0 text-sm">
                <span className="text-gray-400 font-mono w-20 shrink-0">{c.id}</span>
                <span className="flex-1 text-gray-800">{c.member}</span>
                <span className="font-medium text-gray-900">{c.amount}</span>
                <Badge label={c.status} color={CLAIM_COLORS[c.status]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "claims" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Claims Management</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Pending",claims.filter(c=>c.status==="PENDING").length,"bg-yellow-50 border-yellow-100 text-yellow-700"],["Approved",claims.filter(c=>c.status==="APPROVED").length,"bg-green-50 border-green-100 text-green-700"],["Under Review",claims.filter(c=>c.status==="UNDER REVIEW").length,"bg-blue-50 border-blue-100 text-blue-700"],["Rejected",claims.filter(c=>c.status==="REJECTED").length,"bg-red-50 border-red-100 text-red-700"]].map(([l,v,c])=>(
              <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
            ))}
          </div>
          <div className="space-y-3">
            {claims.map(c=>(
              <div key={c.id} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={c.status} color={CLAIM_COLORS[c.status]} />
                      <span className="text-xs text-gray-400 font-mono">{c.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{c.member}</p>
                    <p className="text-sm text-gray-600">{c.type} · {c.facility}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{c.amount}</p>
                    <p className="text-xs text-gray-400">{c.date}</p>
                  </div>
                  {(c.status === "PENDING" || c.status === "UNDER REVIEW") && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => updateClaim(c.id, "APPROVED")} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">Approve</button>
                      <button onClick={() => updateClaim(c.id, "REJECTED")} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "members" && (
        <MembersTab />
      )}

      {tab === "preauth" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Pre-Authorization Requests</h2>
          <div className="space-y-3">
            {PREAUTHS.map(pa=>(
              <div key={pa.id} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={pa.status} color={pa.status==="APPROVED"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                      <span className="text-xs text-gray-400 font-mono">{pa.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{pa.member}</p>
                    <p className="text-sm text-gray-600">{pa.procedure}</p>
                    <p className="text-xs text-gray-500 mt-1">{pa.facility} · {pa.date}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{pa.amount}</p>
                  </div>
                  {pa.status === "PENDING" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">Approve</button>
                      <button className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Decline</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Billing Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4"><p className="text-xs text-green-600 font-medium">Total Paid Out</p><p className="text-2xl font-bold text-green-700 mt-1">KES 1.2M</p></div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4"><p className="text-xs text-yellow-600 font-medium">Pending Claims</p><p className="text-2xl font-bold text-yellow-700 mt-1">KES 57,000</p></div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"><p className="text-xs text-blue-600 font-medium">Premiums Collected</p><p className="text-2xl font-bold text-blue-700 mt-1">KES 2.8M</p></div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Claims by Type</h3>
            <div className="space-y-3">
              {[["Consultations",128],["Surgery",45],["Lab Tests",210],["Maternity",38],["Physiotherapy",62],["Radiology",89]].map(([l,v])=>(
                <Bar key={l as string} label={l as string} value={v as number} max={210} color="bg-pink-500" />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Insurance Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["Monthly Claims Report","Apr 2026","Ready"],["Member Utilisation Report","Apr 2026","Ready"],["Financial Summary","Q1 2026","Ready"],["Claims Rejection Analysis","Mar 2026","Ready"],["Premium Collection Report","Apr 2026","Pending"],["Fraud Detection Report","Q1 2026","In Progress"]].map(([title,period,status])=>(
              <div key={title as string} className={`rounded-xl border p-4 ${status==="Ready"?"bg-green-50 border-green-100":status==="Pending"?"bg-yellow-50 border-yellow-100":"bg-blue-50 border-blue-100"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{title as string}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Period: {period as string}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={status as string} color={status==="Ready"?"bg-green-100 text-green-700":status==="Pending"?"bg-yellow-100 text-yellow-700":"bg-blue-100 text-blue-700"} />
                    {status === "Ready" && <button className="text-xs text-blue-600 hover:underline">Download</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
