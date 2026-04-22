"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",    label: "Overview",           icon: "📊" },
  { id: "cases",       label: "Case Management",    icon: "📁" },
  { id: "assessments", label: "Assessments",        icon: "📋" },
  { id: "referrals",   label: "Referrals",          icon: "🔗" },
  { id: "support",     label: "Support Services",   icon: "🤝" },
  { id: "safeguarding",label: "Safeguarding",       icon: "🛡️" },
  { id: "reports",     label: "Reports",            icon: "📄" },
  { id: "profile",     label: "My Profile",         icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const CASES = [
  { id:"SW-001", patient:"John Doe",     age:39, issue:"Financial hardship — unable to afford medication", priority:"HIGH",   status:"Active",   assignedDate:"Apr 1, 2026",  lastContact:"Apr 20, 2026" },
  { id:"SW-002", patient:"Mary Wanjiku", age:25, issue:"Domestic violence — safe housing needed",          priority:"URGENT", status:"Active",   assignedDate:"Apr 5, 2026",  lastContact:"Apr 21, 2026" },
  { id:"SW-003", patient:"Samuel Kibet", age:55, issue:"Elderly care — family support assessment",         priority:"MEDIUM", status:"Ongoing",  assignedDate:"Mar 20, 2026", lastContact:"Apr 18, 2026" },
  { id:"SW-004", patient:"Grace Otieno", age:18, issue:"Mental health support — post-discharge follow-up", priority:"HIGH",   status:"Ongoing",  assignedDate:"Apr 10, 2026", lastContact:"Apr 19, 2026" },
  { id:"SW-005", patient:"Peter Mwangi", age:62, issue:"Disability benefits application assistance",       priority:"MEDIUM", status:"Resolved", assignedDate:"Mar 1, 2026",  lastContact:"Apr 15, 2026" },
];

const REFERRALS = [
  { patient:"John Doe",     from:"Dr. Sarah Johnson", service:"NHIF Financial Aid",       date:"Apr 8, 2026",  status:"Pending" },
  { patient:"Mary Wanjiku", from:"Dr. Achieng Otieno",service:"Women's Shelter Network",  date:"Apr 5, 2026",  status:"Accepted" },
  { patient:"Grace Otieno", from:"Dr. Peter Kamau",   service:"Mental Health Counselling",date:"Apr 10, 2026", status:"Pending" },
];

const SUPPORT_SERVICES = [
  { name:"NHIF Financial Aid",       category:"Financial",    contact:"0800 720 601",  description:"National health insurance fund assistance" },
  { name:"Women's Shelter Network",  category:"Safety",       contact:"0800 723 253",  description:"Emergency shelter for domestic violence survivors" },
  { name:"Mental Health Kenya",      category:"Mental Health",contact:"0800 723 253",  description:"Free mental health counselling services" },
  { name:"Disability Benefits",      category:"Government",   contact:"020 271 7021",  description:"NCPWD disability registration and benefits" },
  { name:"Children's Services",      category:"Child Welfare",contact:"116",           description:"Child protection and welfare services" },
  { name:"Elderly Care Network",     category:"Elderly",      contact:"020 271 7022",  description:"Community support for elderly patients" },
];

export default function SocialWorkDashboard() {
  const [tab, setTab] = useState("overview");
  const [cases, setCases] = useState(CASES);
  const [toast, setToast] = useState("");
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseForm, setCaseForm] = useState({ patient: "", age: "", issue: "", priority: "MEDIUM", notes: "" });

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("user") || "{}"); } catch { /* ignore */ }
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const addCase = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `SW-${String(cases.length + 1).padStart(3, "0")}`;
    setCases(c => [{ id, ...caseForm, age: Number(caseForm.age), status: "Active", assignedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), lastContact: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...c]);
    setCaseForm({ patient: "", age: "", issue: "", priority: "MEDIUM", notes: "" });
    setShowCaseForm(false);
    showToast("New case opened successfully");
  };

  const resolveCase = (id: string) => {
    setCases(c => c.map(x => x.id === id ? { ...x, status: "Resolved" } : x));
    showToast("Case marked as resolved");
  };

  const PRIORITY_COLORS: Record<string, string> = { URGENT: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700", MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-green-100 text-green-700" };
  const STATUS_COLORS: Record<string, string> = { Active: "bg-blue-100 text-blue-700", Ongoing: "bg-purple-100 text-purple-700", Resolved: "bg-green-100 text-green-700" };
  const REF_COLORS: Record<string, string> = { Pending: "bg-yellow-100 text-yellow-700", Accepted: "bg-green-100 text-green-700", Declined: "bg-red-100 text-red-700" };

  return (
    <DashboardShell title="Social Work Portal" role="Social Worker" accentColor="bg-violet-700" icon="🤝" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Social Work Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Active Cases", cases.filter(c => c.status !== "Resolved").length, "bg-violet-600", "📁"],
              ["Urgent Cases", cases.filter(c => c.priority === "URGENT").length, "bg-red-600", "🚨"],
              ["Pending Referrals", REFERRALS.filter(r => r.status === "Pending").length, "bg-yellow-500", "🔗"],
              ["Resolved", cases.filter(c => c.status === "Resolved").length, "bg-green-600", "✅"]].map(([l, v, c, i]) => (
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Social Worker Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[["📁 Case Management", "Assess, plan, and coordinate patient social needs"],
                ["🛡️ Safeguarding", "Protect vulnerable patients from abuse and neglect"],
                ["🔗 Referrals", "Connect patients to community and government services"],
                ["💰 Financial Aid", "Assist with NHIF, disability benefits, and grants"],
                ["🏠 Housing Support", "Help patients access safe and stable housing"],
                ["👨‍👩‍👧 Family Support", "Mediate family issues and coordinate care"],
                ["🧠 Mental Health", "Provide psychosocial support and counselling"],
                ["📄 Documentation", "Maintain accurate case records and reports"]].map(([t, d]) => (
                <div key={t as string} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="shrink-0">{(t as string).split(" ")[0]}</span>
                  <div><p className="font-medium text-gray-800 text-xs">{(t as string).slice(3)}</p><p className="text-xs text-gray-500">{d as string}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-800 mb-2">🚨 Urgent Cases Requiring Attention</p>
            {cases.filter(c => c.priority === "URGENT" && c.status !== "Resolved").map(c => (
              <div key={c.id} className="text-sm text-amber-700 py-1 border-b border-amber-100 last:border-0">
                <strong>{c.patient}</strong> — {c.issue}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "cases" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Case Management</h2>
            <button onClick={() => setShowCaseForm(true)} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700">+ Open New Case</button>
          </div>

          {showCaseForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCaseForm(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b">
                  <h3 className="text-lg font-bold text-gray-900">Open New Case</h3>
                  <button onClick={() => setShowCaseForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>
                <form onSubmit={addCase} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <input required className={inputCls} value={caseForm.patient} onChange={e => setCaseForm(f => ({ ...f, patient: e.target.value }))} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input required type="number" className={inputCls} value={caseForm.age} onChange={e => setCaseForm(f => ({ ...f, age: e.target.value }))} placeholder="35" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Presenting Issue</label>
                    <textarea required className={inputCls} rows={3} value={caseForm.issue} onChange={e => setCaseForm(f => ({ ...f, issue: e.target.value }))} placeholder="Describe the social issue or need..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["LOW", "MEDIUM", "HIGH", "URGENT"].map(p => (
                        <button key={p} type="button" onClick={() => setCaseForm(f => ({ ...f, priority: p }))}
                          className={`py-2 rounded-lg text-xs font-medium border transition-colors ${caseForm.priority === p ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes</label>
                    <textarea className={inputCls} rows={2} value={caseForm.notes} onChange={e => setCaseForm(f => ({ ...f, notes: e.target.value }))} placeholder="Initial assessment notes..." />
                  </div>
                  <div className="flex gap-3 pt-2 border-t">
                    <button type="button" onClick={() => setShowCaseForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="flex-1 bg-violet-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-700">Open Case</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {cases.map(c => (
              <div key={c.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${c.priority === "URGENT" ? "border-red-500" : c.priority === "HIGH" ? "border-orange-500" : c.priority === "MEDIUM" ? "border-yellow-400" : "border-green-400"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge label={c.priority} color={PRIORITY_COLORS[c.priority]} />
                      <Badge label={c.status} color={STATUS_COLORS[c.status]} />
                      <span className="text-xs text-gray-400 font-mono">{c.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{c.patient} <span className="text-gray-400 font-normal text-sm">(Age {c.age})</span></p>
                    <p className="text-sm text-gray-600 mt-0.5">{c.issue}</p>
                    <p className="text-xs text-gray-400 mt-1">Assigned: {c.assignedDate} · Last contact: {c.lastContact}</p>
                  </div>
                  {c.status !== "Resolved" && (
                    <button onClick={() => resolveCase(c.id)} className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg font-medium shrink-0">Resolve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "assessments" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Social Assessments</h2>
          <div className="space-y-3">
            {cases.filter(c => c.status !== "Resolved").map(c => (
              <div key={c.id} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{c.patient}</p>
                    <p className="text-sm text-violet-700">{c.issue}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      {[["Housing", "Stable"], ["Financial", "At Risk"], ["Family Support", "Limited"], ["Mental Health", "Needs Review"]].map(([k, v]) => (
                        <div key={k} className="bg-gray-50 rounded-lg p-2">
                          <p className="text-gray-400">{k}</p>
                          <p className={`font-medium ${v === "Stable" ? "text-green-700" : v === "At Risk" ? "text-red-700" : "text-yellow-700"}`}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => showToast(`Assessment form opened for ${c.patient}`)}
                    className="text-xs bg-violet-100 text-violet-700 hover:bg-violet-200 px-3 py-1.5 rounded-lg font-medium shrink-0">Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "referrals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Referrals</h2>
            <button onClick={() => showToast("Referral form — connect to referral system")}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700">+ New Referral</button>
          </div>
          <div className="space-y-3">
            {REFERRALS.map((r, i) => (
              <div key={i} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${r.status === "Accepted" ? "border-green-500" : "border-yellow-400"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={r.status} color={REF_COLORS[r.status]} />
                    </div>
                    <p className="font-semibold text-gray-900">{r.patient}</p>
                    <p className="text-sm text-violet-700 font-medium">{r.service}</p>
                    <p className="text-xs text-gray-500 mt-1">Referred by: {r.from} · {r.date}</p>
                  </div>
                  {r.status === "Pending" && (
                    <button onClick={() => showToast("Following up on referral...")}
                      className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1.5 rounded-lg font-medium shrink-0">Follow Up</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "support" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Support Services Directory</h2>
          <div className="space-y-3">
            {SUPPORT_SERVICES.map(s => (
              <div key={s.name} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={s.category} color="bg-violet-100 text-violet-700" />
                    </div>
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{s.description}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">📞 {s.contact}</p>
                  </div>
                  <button onClick={() => showToast(`Referral to ${s.name} initiated`)}
                    className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 font-medium shrink-0">Refer Patient</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "safeguarding" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Safeguarding</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-semibold text-red-800 mb-2">🛡️ Active Safeguarding Concern</p>
            <p className="text-sm text-red-700"><strong>Mary Wanjiku</strong> — Domestic violence case. Safe housing referral in progress.</p>
            <p className="text-xs text-red-500 mt-1">Last updated: Apr 21, 2026 · Assigned to: Social Worker</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Safeguarding Categories</h3>
            <div className="space-y-3">
              {[["🧒 Child Protection", "Abuse, neglect, exploitation of minors", "116"],
                ["👩 Domestic Violence", "Physical, emotional, financial abuse", "0800 723 253"],
                ["👴 Elder Abuse", "Neglect or abuse of elderly patients", "020 271 7022"],
                ["🧠 Mental Health Crisis", "Patients at risk of self-harm", "0800 723 253"],
                ["♿ Disability Exploitation", "Exploitation of disabled individuals", "020 271 7021"]].map(([t, d, c]) => (
                <div key={t as string} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t as string}</p>
                    <p className="text-xs text-gray-500">{d as string}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium shrink-0">📞 {c as string}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => showToast("Safeguarding report submitted to management")}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700">
            🚨 Submit Safeguarding Report
          </button>
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Social Work Reports</h2>
          <div className="grid grid-cols-2 gap-3">
            {[["Total Cases", cases.length, "bg-violet-50 border-violet-100 text-violet-700"],
              ["Active", cases.filter(c => c.status !== "Resolved").length, "bg-blue-50 border-blue-100 text-blue-700"],
              ["Resolved", cases.filter(c => c.status === "Resolved").length, "bg-green-50 border-green-100 text-green-700"],
              ["Urgent", cases.filter(c => c.priority === "URGENT").length, "bg-red-50 border-red-100 text-red-700"]].map(([l, v, c]) => (
              <div key={l as string} className={`rounded-xl border p-4 text-center ${c}`}>
                <p className="text-3xl font-bold">{v as number}</p>
                <p className="text-sm font-medium mt-1">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Case Summary by Issue Type</h3>
            {[["Financial Hardship", 2], ["Domestic Violence", 1], ["Elderly Care", 1], ["Mental Health", 1]].map(([type, count]) => (
              <div key={type as string} className="flex items-center gap-3 py-2 border-b last:border-0">
                <p className="text-sm text-gray-700 flex-1">{type as string}</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${((count as number) / cases.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-4">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => showToast("Monthly report exported")}
            className="w-full border border-violet-300 text-violet-700 py-3 rounded-xl font-medium hover:bg-violet-50">
            📄 Export Monthly Report
          </button>
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
