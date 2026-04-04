"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import UserProfile from "@/components/profile/UserProfile";
import { inspectionReports, InspectionReport } from "@/lib/store";

const NAV = [
  { id: "overview",    label: "Overview",          icon: "📊" },
  { id: "compliance",  label: "Compliance",        icon: "📜" },
  { id: "inspections", label: "Inspections",       icon: "🔍" },
  { id: "licenses",    label: "Licenses",          icon: "🏅" },
  { id: "statistics",  label: "Health Statistics", icon: "📈" },
  { id: "incidents",   label: "Incident Reports",  icon: "⚠️" },
  { id: "policies",    label: "Policies",          icon: "📋" },
  { id: "profile",     label: "My Profile",        icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-500 w-32 shrink-0 text-right">{label}</span>
    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${(value/max)*100}%` }} />
    </div>
    <span className="text-xs font-semibold text-gray-700 w-12">{value.toLocaleString()}</span>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b bg-teal-700 rounded-t-2xl text-white">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-teal-200 hover:text-white text-2xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const FACILITIES = [
  { name:"Medicare Hospital",      type:"Level 5",  county:"Nairobi",   license:"MOH/2021/001", expires:"Dec 2026", status:"Valid",       lastInspection:"Jan 2026", beds:120, staff:85, patients:98 },
  { name:"City Clinic",            type:"Level 3",  county:"Nairobi",   license:"MOH/2020/045", expires:"Mar 2027", status:"Valid",       lastInspection:"Feb 2026", beds:40,  staff:22, patients:31 },
  { name:"Rural Health Center",    type:"Level 2",  county:"Kakamega",  license:"MOH/2019/112", expires:"Apr 2026", status:"Renewal Due", lastInspection:"Oct 2025", beds:20,  staff:12, patients:14 },
  { name:"Westlands Medical",      type:"Level 4",  county:"Nairobi",   license:"MOH/2022/078", expires:"Aug 2027", status:"Valid",       lastInspection:"Mar 2026", beds:60,  staff:38, patients:45 },
  { name:"Kisumu General Hospital",type:"Level 5",  county:"Kisumu",    license:"MOH/2020/033", expires:"Jun 2026", status:"Valid",       lastInspection:"Dec 2025", beds:100, staff:72, patients:84 },
];

const INSPECTIONS = [
  { facility:"Rural Health Center",    date:"Apr 10, 2026", inspector:"MOH Inspector",  type:"Routine",    status:"Scheduled", findings:"", recommendations:"" },
  { facility:"City Clinic",            date:"Apr 15, 2026", inspector:"MOH Inspector",  type:"Follow-up",  status:"Scheduled", findings:"", recommendations:"" },
  { facility:"Medicare Hospital",      date:"Jan 15, 2026", inspector:"MOH Inspector",  type:"Routine",    status:"Completed", score:"94/100",
    findings:"1. Infection control protocols well maintained.\n2. Staff training records up to date.\n3. Minor issue: one emergency exit sign not illuminated.\n4. Pharmacy storage temperatures within range.",
    recommendations:"1. Replace emergency exit sign bulb within 30 days.\n2. Continue quarterly staff training.\n3. Submit updated waste disposal records by Feb 2026." },
  { facility:"Westlands Medical",      date:"Mar 20, 2026", inspector:"MOH Inspector",  type:"Routine",    status:"Completed", score:"88/100",
    findings:"1. Patient records management needs improvement.\n2. Lab equipment calibration certificates expired for 2 instruments.\n3. Adequate staffing levels maintained.",
    recommendations:"1. Update lab equipment calibration within 14 days.\n2. Implement electronic records system.\n3. Conduct fire drill within 60 days." },
];

const INCIDENTS = [
  { id:"INC-001", facility:"City Clinic",         type:"Medication Error",    severity:"Moderate", date:"Apr 2, 2026",  status:"Under Investigation",
    description:"Patient received incorrect dosage of anticoagulant. Patient monitored and stable. Incident reported by attending nurse.",
    actions:"1. Immediate patient assessment conducted.\n2. Pharmacy protocols under review.\n3. Staff retraining scheduled for Apr 15, 2026." },
  { id:"INC-002", facility:"Rural Health Center", type:"Equipment Failure",   severity:"Minor",    date:"Mar 28, 2026", status:"Resolved",
    description:"Autoclave unit failed during sterilisation cycle. No patient harm. Backup sterilisation protocols activated.",
    actions:"1. Equipment serviced and repaired on Mar 29, 2026.\n2. Backup autoclave unit procured.\n3. Maintenance schedule updated." },
  { id:"INC-003", facility:"Medicare Hospital",   type:"Patient Fall",        severity:"Minor",    date:"Mar 15, 2026", status:"Resolved",
    description:"Elderly patient fell while attempting to use bathroom unassisted. Minor bruising. No fractures.",
    actions:"1. Patient assessed — no serious injury.\n2. Fall prevention protocol reinforced.\n3. Bed rails and call bell system checked." },
];

const POLICIES = [
  { title:"National Infection Prevention & Control Guidelines", version:"v3.2", issued:"Jan 2026", status:"Active",
    summary:"Comprehensive guidelines for infection prevention in all healthcare facilities. Covers hand hygiene, PPE use, isolation procedures, and environmental cleaning.",
    scope:"All licensed healthcare facilities in Kenya.", authority:"Ministry of Health — Infection Prevention Division." },
  { title:"Healthcare Waste Management Policy", version:"v2.1", issued:"Jun 2025", status:"Active",
    summary:"Policy governing the safe collection, segregation, storage, transport, and disposal of healthcare waste including sharps, pharmaceuticals, and infectious materials.",
    scope:"All healthcare facilities generating clinical waste.", authority:"Ministry of Health & NEMA." },
  { title:"Patient Rights & Responsibilities Charter", version:"v1.5", issued:"Mar 2025", status:"Active",
    summary:"Defines the rights of patients including informed consent, confidentiality, access to records, and the right to refuse treatment. Also outlines patient responsibilities.",
    scope:"All public and private healthcare facilities.", authority:"Ministry of Health — Patient Safety Division." },
  { title:"Medical Practitioners Licensing Regulations", version:"v4.0", issued:"Jan 2026", status:"Active",
    summary:"Regulations governing the registration, licensing, and practice of medical practitioners including doctors, nurses, pharmacists, and allied health professionals.",
    scope:"All medical practitioners in Kenya.", authority:"Kenya Medical Practitioners & Dentists Council (KMPDC)." },
  { title:"National Blood Transfusion Policy", version:"v2.0", issued:"Sep 2024", status:"Under Review",
    summary:"Policy covering blood donation, screening, storage, and transfusion practices. Currently under review to incorporate new WHO guidelines on pathogen reduction.",
    scope:"All facilities performing blood transfusions.", authority:"Kenya National Blood Transfusion Service (KNBTS)." },
];

export default function GovernmentDashboard() {
  const [tab, setTab] = useState("overview");
  const [viewInspection, setViewInspection] = useState<typeof INSPECTIONS[0] | null>(null);
  const [viewIncident, setViewIncident] = useState<typeof INCIDENTS[0] | null>(null);
  const [viewPolicy, setViewPolicy] = useState<typeof POLICIES[0] | null>(null);
  const [viewFacility, setViewFacility] = useState<typeof FACILITIES[0] | null>(null);
  const [savedReports, setSavedReports] = useState<InspectionReport[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportToast, setReportToast] = useState("");
  const [reportForm, setReportForm] = useState({ facility:"Medicare Hospital", date:"", inspector:"MOH Inspector", type:"Routine", status:"Completed", score:"", findings:"", recommendations:"" });

  useEffect(() => { setSavedReports(inspectionReports.getAll()); }, []);

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    inspectionReports.add(reportForm);
    setSavedReports(inspectionReports.getAll());
    setShowReportForm(false);
    setReportToast("Inspection report submitted successfully");
    setTimeout(() => setReportToast(""), 3000);
    setReportForm({ facility:"Medicare Hospital", date:"", inspector:"MOH Inspector", type:"Routine", status:"Completed", score:"", findings:"", recommendations:"" });
  };

  return (
    <DashboardShell title="Regulatory Portal" role="Government & Regulatory Body" accentColor="bg-teal-700" icon="🏛️" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {reportToast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {reportToast}</div>}

      {showReportForm && (
        <Modal title="Submit Inspection Report" onClose={() => setShowReportForm(false)}>
          <form onSubmit={submitReport} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Facility</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={reportForm.facility} onChange={e=>setReportForm(f=>({...f,facility:e.target.value}))}>
                  {FACILITIES.map(f=><option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input required type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={reportForm.date} onChange={e=>setReportForm(f=>({...f,date:e.target.value}))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={reportForm.type} onChange={e=>setReportForm(f=>({...f,type:e.target.value}))}>
                  {["Routine","Follow-up","Complaint","Emergency"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Score (e.g. 94/100)</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={reportForm.score} onChange={e=>setReportForm(f=>({...f,score:e.target.value}))} placeholder="94/100" />
              </div>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Findings *</label>
              <textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={4} value={reportForm.findings} onChange={e=>setReportForm(f=>({...f,findings:e.target.value}))} placeholder="List all findings from the inspection..." />
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Recommendations *</label>
              <textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} value={reportForm.recommendations} onChange={e=>setReportForm(f=>({...f,recommendations:e.target.value}))} placeholder="List recommended actions..." />
            </div>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={()=>setShowReportForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700">Submit Report</button>
            </div>
          </form>
        </Modal>
      )}
      {viewFacility && (
        <Modal title={`Facility Report — ${viewFacility.name}`} onClose={() => setViewFacility(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[["Facility Name",viewFacility.name],["Type",viewFacility.type],["County",viewFacility.county],["License No.",viewFacility.license],["License Expires",viewFacility.expires],["Last Inspection",viewFacility.lastInspection],["Total Beds",String(viewFacility.beds)],["Staff Count",String(viewFacility.staff)],["Current Patients",String(viewFacility.patients)]].map(([k,v])=>(
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <Badge label={viewFacility.status} color={viewFacility.status==="Valid"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
              <p className="text-xs text-gray-400">Bed occupancy: {Math.round((viewFacility.patients/viewFacility.beds)*100)}%</p>
            </div>
          </div>
        </Modal>
      )}

      {viewInspection && (
        <Modal title={`Inspection Report — ${viewInspection.facility}`} onClose={() => setViewInspection(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[["Facility",viewInspection.facility],["Date",viewInspection.date],["Inspector",viewInspection.inspector],["Type",viewInspection.type],["Status",viewInspection.status],["Score",viewInspection.score||"Pending"]].map(([k,v])=>(
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            {viewInspection.findings && (
              <div>
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Findings</p>
                <div className="bg-blue-50 rounded-lg p-3 text-gray-700 whitespace-pre-line">{viewInspection.findings}</div>
              </div>
            )}
            {viewInspection.recommendations && (
              <div>
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Recommendations</p>
                <div className="bg-green-50 rounded-lg p-3 text-gray-700 whitespace-pre-line">{viewInspection.recommendations}</div>
              </div>
            )}
            {viewInspection.status === "Scheduled" && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-orange-700 text-xs">
                ⏳ This inspection is scheduled. Report will be available after completion.
              </div>
            )}
          </div>
        </Modal>
      )}

      {viewIncident && (
        <Modal title={`Incident Report — ${viewIncident.id}`} onClose={() => setViewIncident(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[["Incident ID",viewIncident.id],["Facility",viewIncident.facility],["Type",viewIncident.type],["Severity",viewIncident.severity],["Date",viewIncident.date],["Status",viewIncident.status]].map(([k,v])=>(
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Description</p>
              <div className="bg-red-50 rounded-lg p-3 text-gray-700">{viewIncident.description}</div>
            </div>
            <div>
              <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Actions Taken</p>
              <div className="bg-green-50 rounded-lg p-3 text-gray-700 whitespace-pre-line">{viewIncident.actions}</div>
            </div>
          </div>
        </Modal>
      )}

      {viewPolicy && (
        <Modal title={viewPolicy.title} onClose={() => setViewPolicy(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[["Version",viewPolicy.version],["Issued",viewPolicy.issued],["Status",viewPolicy.status],["Authority",viewPolicy.authority]].map(([k,v])=>(
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Summary</p>
              <div className="bg-blue-50 rounded-lg p-3 text-gray-700">{viewPolicy.summary}</div>
            </div>
            <div>
              <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Scope</p>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700">{viewPolicy.scope}</div>
            </div>
          </div>
        </Modal>
      )}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Regulatory Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Licensed Facilities" value="142" icon="🏅" color="bg-teal-600" />
            <StatCard label="Pending Inspections" value="8" icon="🔍" color="bg-orange-500" />
            <StatCard label="Compliance Rate" value="96%" icon="📜" color="bg-green-600" />
            <StatCard label="Open Incidents" value="3" icon="⚠️" color="bg-red-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Compliance","compliance","📜","bg-teal-50 border-teal-100 text-teal-700"],["Inspections","inspections","🔍","bg-orange-50 border-orange-100 text-orange-700"],["Licenses","licenses","🏅","bg-blue-50 border-blue-100 text-blue-700"],["Incidents","incidents","⚠️","bg-red-50 border-red-100 text-red-700"]].map(([label,id,icon,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">Compliance Status</h3>
              {FACILITIES.slice(0,3).map(f=>(
                <div key={f.name} className="py-2.5 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{f.name}</p>
                    <Badge label={f.status} color={f.status==="Valid"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">License expires: {f.expires}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">National Health Stats</h3>
              {[["Outpatient Visits","48,204"],["Inpatient Admissions","12,890"],["Surgeries Performed","3,421"],["Maternal Deliveries","1,204"]].map(([k,v])=>(
                <div key={k} className="flex justify-between py-2 border-b last:border-0 text-sm">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "compliance" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Facility Compliance</h2>
          <div className="space-y-3">
            {FACILITIES.map(f=>(
              <div key={f.name} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{f.name}</p>
                      <Badge label={f.status} color={f.status==="Valid"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
                      {[["Type",f.type],["County",f.county],["License",f.license],["Expires",f.expires]].map(([k,v])=>(
                        <div key={k} className="bg-gray-50 rounded p-2"><p className="text-gray-400">{k}</p><p className="font-medium text-gray-800">{v}</p></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Last inspection: {f.lastInspection}</p>
                  </div>
                  <button onClick={() => setViewFacility(f)} className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-200 font-medium shrink-0">View Report</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "inspections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Inspections</h2>
            <button onClick={() => setShowReportForm(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">+ Submit Report</button>
          </div>
          {savedReports.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Submitted Reports</p>
              {savedReports.map(r=>(
                <div key={r.id} className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{r.facility} — {r.type}</p>
                    <span className="text-xs text-gray-400">{r.date} {r.score && `· ${r.score}`}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{r.findings}</p>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {INSPECTIONS.map((ins,i)=>(
              <div key={i} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${ins.status==="Scheduled"?"border-orange-400":"border-green-500"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={ins.status} color={ins.status==="Scheduled"?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"} />
                      <Badge label={ins.type} color="bg-blue-100 text-blue-700" />
                    </div>
                    <p className="font-semibold text-gray-900">{ins.facility}</p>
                    <p className="text-xs text-gray-500 mt-1">Inspector: {ins.inspector} · Date: {ins.date}</p>
                    {ins.score && <p className="text-sm font-medium text-green-700 mt-1">Score: {ins.score}</p>}
                  </div>
                  {ins.status === "Scheduled" && <button onClick={() => setViewInspection(ins)} className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-200 font-medium shrink-0">View Details</button>}
                  {ins.status === "Completed" && <button onClick={() => setViewInspection(ins)} className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-200 font-medium shrink-0">View Report</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "licenses" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Facility Licenses</h2>
          <div className="grid grid-cols-3 gap-3">
            {[["Valid",FACILITIES.filter(f=>f.status==="Valid").length,"bg-green-50 border-green-100 text-green-700"],["Renewal Due",FACILITIES.filter(f=>f.status==="Renewal Due").length,"bg-yellow-50 border-yellow-100 text-yellow-700"],["Total",FACILITIES.length,"bg-gray-50 border-gray-100 text-gray-700"]].map(([l,v,c])=>(
              <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Facility","Type","County","License No.","Expires","Status"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {FACILITIES.map(f=>(
                  <tr key={f.name} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                    <td className="px-4 py-3 text-gray-600">{f.type}</td>
                    <td className="px-4 py-3 text-gray-600">{f.county}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.license}</td>
                    <td className="px-4 py-3 text-gray-600">{f.expires}</td>
                    <td className="px-4 py-3"><Badge label={f.status} color={f.status==="Valid"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "statistics" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">National Health Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Outpatient Visits" value="48,204" icon="🏥" color="bg-teal-600" />
            <StatCard label="Inpatient Admissions" value="12,890" icon="🛏️" color="bg-blue-600" />
            <StatCard label="Maternal Deliveries" value="1,204" icon="👶" color="bg-pink-600" />
            <StatCard label="Surgeries" value="3,421" icon="🔪" color="bg-purple-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Top Diagnoses</h3>
              <div className="space-y-3">
                {[["Malaria",4820],["Hypertension",3210],["Diabetes",2890],["Pneumonia",2340],["HIV/AIDS",1980],["TB",1240]].map(([l,v])=>(
                  <Bar key={l as string} label={l as string} value={v as number} max={4820} color="bg-teal-500" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Facility Utilisation</h3>
              <div className="space-y-3">
                {[["Level 5 Hospitals",78],["Level 4 Hospitals",65],["Level 3 Clinics",82],["Level 2 Dispensaries",91]].map(([l,v])=>(
                  <Bar key={l as string} label={l as string} value={v as number} max={100} color="bg-blue-500" />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Bed occupancy rate (%)</p>
            </div>
          </div>
        </div>
      )}

      {tab === "incidents" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Incident Reports</h2>
          <div className="space-y-3">
            {INCIDENTS.map(inc=>(
              <div key={inc.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${inc.severity==="Moderate"?"border-orange-500":inc.severity==="Minor"?"border-yellow-400":"border-red-500"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={inc.severity} color={inc.severity==="Moderate"?"bg-orange-100 text-orange-700":"bg-yellow-100 text-yellow-700"} />
                      <Badge label={inc.status} color={inc.status==="Resolved"?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"} />
                      <span className="text-xs text-gray-400 font-mono">{inc.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{inc.type}</p>
                    <p className="text-sm text-gray-600">{inc.facility}</p>
                    <p className="text-xs text-gray-400 mt-1">{inc.date}</p>
                  </div>
                  <button onClick={() => setViewIncident(inc)} className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-200 font-medium shrink-0">View Report</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "policies" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Health Policies & Guidelines</h2>
          <div className="space-y-3">
            {POLICIES.map(p=>(
              <div key={p.title} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Version {p.version} · Issued: {p.issued}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge label={p.status} color={p.status==="Active"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} />
                    <button onClick={() => setViewPolicy(p)} className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-200 font-medium">View</button>
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
