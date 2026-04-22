"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import UserProfile from "@/components/profile/UserProfile";
import { schedule, beds, notifications, StaffSchedule, BedRecord } from "@/lib/store";

const NAV = [
  { id: "overview",      label: "Overview",         icon: "📊" },
  { id: "departments",   label: "Departments",      icon: "🏢" },
  { id: "staff",         label: "Staff Management", icon: "👥" },
  { id: "schedule_mgmt", label: "Staff Schedule",   icon: "🗓️" },
  { id: "beds",          label: "Bed Management",   icon: "🛏️" },
  { id: "finance",       label: "Finance & Budget", icon: "💰" },
  { id: "performance",   label: "Performance",      icon: "📈" },
  { id: "compliance",    label: "Compliance",       icon: "📜" },
  { id: "reports",       label: "Reports",          icon: "📋" },
  { id: "profile",       label: "My Profile",       icon: "👤" },
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
    <span className="text-xs font-semibold text-gray-700 w-8">{value}</span>
  </div>
);

const DEPARTMENTS = [
  { name:"Cardiology",       head:"Dr. Sarah Johnson", staff:12, beds:20, occupied:19, budget:"KES 2.1M", status:"Operational" },
  { name:"Paediatrics",      head:"Dr. Peter Kamau",   staff:8,  beds:15, occupied:12, budget:"KES 1.4M", status:"Operational" },
  { name:"General Surgery",  head:"Dr. Achieng Otieno",staff:15, beds:25, occupied:18, budget:"KES 2.8M", status:"Operational" },
  { name:"Gynaecology",      head:"Dr. Faith Wanjiku", staff:10, beds:18, occupied:14, budget:"KES 1.9M", status:"Operational" },
  { name:"Laboratory",       head:"Kevin Otieno",      staff:6,  beds:0,  occupied:0,  budget:"KES 0.8M", status:"Operational" },
  { name:"Pharmacy",         head:"Grace Mwangi",      staff:4,  beds:0,  occupied:0,  budget:"KES 1.2M", status:"Operational" },
];

const STAFF = [
  { name:"Dr. Sarah Johnson",  role:"Doctor",       dept:"Cardiology",      status:"On Duty",  shift:"Morning" },
  { name:"Emma Wilson",        role:"Nurse",        dept:"Ward / Nursing",  status:"On Duty",  shift:"Morning" },
  { name:"Dr. Peter Kamau",    role:"Doctor",       dept:"General Medicine",status:"On Duty",  shift:"Morning" },
  { name:"Kevin Otieno",       role:"Lab Tech",     dept:"Laboratory",      status:"On Duty",  shift:"Morning" },
  { name:"Grace Mwangi",       role:"Pharmacist",   dept:"Pharmacy",        status:"On Leave", shift:"—" },
  { name:"James Kariuki",      role:"Radiographer", dept:"Radiology",       status:"Off Duty", shift:"Afternoon" },
];

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

function ScheduleTab() {
  const [sched, setSched] = useState<StaffSchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staffName:"", staffEmail:"", date:"", shift:"Morning (07:00–15:00)", department:"", status:"Confirmed" });
  const [toast, setToast] = useState("");

  useEffect(() => { setSched(schedule.getAll()); }, []);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    schedule.add(form);
    notifications.add({ userId: form.staffEmail, message:`You have been scheduled for ${form.shift} on ${form.date} — ${form.department}`, type:"info", read:false });
    setSched(schedule.getAll());
    setForm({ staffName:"", staffEmail:"", date:"", shift:"Morning (07:00–15:00)", department:"", status:"Confirmed" });
    setShowForm(false);
    setToast("Schedule added and staff notified");
    setTimeout(() => setToast(""), 3000);
  };

  const del = (id: string) => { schedule.delete(id); setSched(schedule.getAll()); };

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Schedule</h3>
            <form onSubmit={add} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Staff Name"><input required className={inputCls} value={form.staffName} onChange={e=>setForm(f=>({...f,staffName:e.target.value}))} /></Field>
                <Field label="Staff Email"><input required type="email" className={inputCls} value={form.staffEmail} onChange={e=>setForm(f=>({...f,staffEmail:e.target.value}))} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date"><input required type="date" className={inputCls} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></Field>
                <Field label="Shift">
                  <select className={inputCls} value={form.shift} onChange={e=>setForm(f=>({...f,shift:e.target.value}))}>
                    {["Morning (07:00–15:00)","Afternoon (15:00–23:00)","Night (23:00–07:00)","On Call"].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Department"><input required className={inputCls} value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))} /></Field>
              <div className="flex gap-3 pt-2 border-t">
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add & Notify Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Staff Schedule</h2>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Schedule</button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead><tr className="bg-gray-50 border-b">{["Staff","Email","Date","Shift","Department","Status","Action"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody>
            {sched.map(s=>(
              <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{s.staffName}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{s.staffEmail}</td>
                <td className="px-4 py-3 text-gray-600">{s.date}</td>
                <td className="px-4 py-3 text-gray-600">{s.shift}</td>
                <td className="px-4 py-3 text-gray-600">{s.department}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{s.status}</span></td>
                <td className="px-4 py-3"><button onClick={() => del(s.id)} className="text-xs text-red-500 hover:underline">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {sched.length === 0 && <p className="text-center py-8 text-gray-400">No schedules yet</p>}
      </div>
    </div>
  );
}

function BedsTab() {
  const [bedList, setBedList] = useState<BedRecord[]>([]);
  useEffect(() => { setBedList(beds.getAll()); }, []);

  const discharge = (id: string) => {
    beds.update(id, { patientName:"", admittedAt:"", status:"Available", doctor:"" });
    setBedList(beds.getAll());
  };

  const BED_COLORS: Record<string,string> = { Available:"bg-green-100 text-green-700", Occupied:"bg-red-100 text-red-700", "Post-Op":"bg-purple-100 text-purple-700", Cleaning:"bg-yellow-100 text-yellow-700" };
  const occupied = bedList.filter(b=>b.status!=="Available").length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Bed Management</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-red-700">{occupied}</p><p className="text-xs text-red-600 font-medium">Occupied</p></div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-green-700">{bedList.length - occupied}</p><p className="text-xs text-green-600 font-medium">Available</p></div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-gray-700">{Math.round((occupied/bedList.length)*100)}%</p><p className="text-xs text-gray-500 font-medium">Occupancy</p></div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead><tr className="bg-gray-50 border-b">{["Ward","Bed","Patient","Admitted","Doctor","Status","Action"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody>
            {bedList.map(b=>(
              <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{b.ward}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.bedNo}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{b.patientName || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{b.admittedAt || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{b.doctor || "—"}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BED_COLORS[b.status]||"bg-gray-100 text-gray-700"}`}>{b.status}</span></td>
                <td className="px-4 py-3">
                  {b.status !== "Available" && <button onClick={() => discharge(b.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 font-medium">Discharge</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManagementDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Management" role="Hospital Management" accentColor="bg-indigo-700" icon="🏛️" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Hospital Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value="KES 2.4M" icon="💰" color="bg-indigo-700" />
            <StatCard label="Bed Occupancy" value="78%" icon="🛏️" color="bg-blue-600" />
            <StatCard label="Staff on Duty" value="34" icon="👥" color="bg-green-600" />
            <StatCard label="Patient Satisfaction" value="94%" icon="⭐" color="bg-yellow-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Departments","departments","🏢","bg-blue-50 border-blue-100 text-blue-700"],["Staff","staff","👥","bg-green-50 border-green-100 text-green-700"],["Finance","finance","💰","bg-indigo-50 border-indigo-100 text-indigo-700"],["Reports","reports","📋","bg-purple-50 border-purple-100 text-purple-700"]].map(([label,id,icon,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEPARTMENTS.slice(0,3).map(d=>(
              <div key={d.name} className="bg-white rounded-xl border shadow-sm p-4">
                <p className="font-semibold text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.staff} staff · {d.beds > 0 ? `${d.occupied}/${d.beds} beds` : "Outpatient"}</p>
                <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                  {d.beds > 0 && <div className="h-full bg-indigo-500 rounded-full" style={{width:`${(d.occupied/d.beds)*100}%`}} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "departments" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Departments</h2>
          <div className="space-y-3">
            {DEPARTMENTS.map(d=>(
              <div key={d.name} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{d.name}</p>
                      <Badge label={d.status} color="bg-green-100 text-green-700" />
                    </div>
                    <p className="text-sm text-gray-500">Head: {d.head}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
                      <div className="bg-gray-50 rounded p-2"><p className="text-gray-400">Staff</p><p className="font-semibold text-gray-800">{d.staff}</p></div>
                      {d.beds > 0 && <div className="bg-gray-50 rounded p-2"><p className="text-gray-400">Beds</p><p className="font-semibold text-gray-800">{d.occupied}/{d.beds}</p></div>}
                      <div className="bg-gray-50 rounded p-2"><p className="text-gray-400">Budget</p><p className="font-semibold text-gray-800">{d.budget}</p></div>
                      {d.beds > 0 && <div className="bg-gray-50 rounded p-2"><p className="text-gray-400">Occupancy</p><p className="font-semibold text-gray-800">{Math.round((d.occupied/d.beds)*100)}%</p></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "staff" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Staff Management</h2>
          <div className="grid grid-cols-3 gap-3">
            {[["On Duty",STAFF.filter(s=>s.status==="On Duty").length,"bg-green-50 border-green-100 text-green-700"],["On Leave",STAFF.filter(s=>s.status==="On Leave").length,"bg-yellow-50 border-yellow-100 text-yellow-700"],["Total",STAFF.length,"bg-gray-50 border-gray-100 text-gray-700"]].map(([l,v,c])=>(
              <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Name","Role","Department","Status","Shift"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {STAFF.map(s=>(
                  <tr key={s.name} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.role}</td>
                    <td className="px-4 py-3 text-gray-600">{s.dept}</td>
                    <td className="px-4 py-3"><Badge label={s.status} color={s.status==="On Duty"?"bg-green-100 text-green-700":s.status==="On Leave"?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-600"} /></td>
                    <td className="px-4 py-3 text-gray-500">{s.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "schedule_mgmt" && <ScheduleTab />}
      {tab === "beds" && <BedsTab />}

      {tab === "finance" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Finance & Budget</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4"><p className="text-xs text-green-600 font-medium">Monthly Revenue</p><p className="text-2xl font-bold text-green-700 mt-1">KES 2.4M</p><p className="text-xs text-green-600 mt-0.5">↑ 18% vs last month</p></div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4"><p className="text-xs text-red-600 font-medium">Monthly Expenses</p><p className="text-2xl font-bold text-red-700 mt-1">KES 1.8M</p><p className="text-xs text-red-600 mt-0.5">Salaries, supplies, utilities</p></div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"><p className="text-xs text-blue-600 font-medium">Net Profit</p><p className="text-2xl font-bold text-blue-700 mt-1">KES 600K</p><p className="text-xs text-blue-600 mt-0.5">25% margin</p></div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Revenue by Department</h3>
            <div className="space-y-3">
              {[["Cardiology",840],["Surgery",1100],["Laboratory",460],["Pharmacy",320],["Gynaecology",280],["Paediatrics",200]].map(([l,v])=>(
                <Bar key={l as string} label={l as string} value={v as number} max={1100} color="bg-indigo-500" />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Values in KES thousands</p>
          </div>
        </div>
      )}

      {tab === "performance" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Patient Satisfaction" value="94%" icon="⭐" color="bg-yellow-500" />
            <StatCard label="Avg. Wait Time" value="18 min" icon="⏱️" color="bg-blue-600" />
            <StatCard label="Bed Turnover Rate" value="4.2" icon="🛏️" color="bg-green-600" />
            <StatCard label="Staff Attendance" value="96%" icon="👥" color="bg-indigo-600" />
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Department Performance</h3>
            <div className="space-y-3">
              {[["Cardiology",95],["Surgery",88],["Paediatrics",92],["Laboratory",97],["Pharmacy",90],["Gynaecology",85]].map(([l,v])=>(
                <Bar key={l as string} label={l as string} value={v as number} max={100} color="bg-green-500" />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Patient satisfaction score (%)</p>
          </div>
        </div>
      )}

      {tab === "compliance" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Compliance & Accreditation</h2>
          <div className="space-y-3">
            {[
              ["MOH License",          "Valid",   "Expires Dec 2026", "bg-green-100 text-green-700"],
              ["KENAS Accreditation",  "Valid",   "Expires Jun 2027", "bg-green-100 text-green-700"],
              ["Fire Safety Certificate","Valid", "Expires Sep 2026", "bg-green-100 text-green-700"],
              ["Infection Control Audit","Due",   "Last: Jan 2026",   "bg-yellow-100 text-yellow-700"],
              ["Staff Training Records","Partial","68% complete",     "bg-orange-100 text-orange-700"],
            ].map(([name,status,detail,cls])=>(
              <div key={name as string} className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{name as string}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{detail as string}</p>
                </div>
                <Badge label={status as string} color={cls as string} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Management Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Monthly Financial Report","Apr 2026","Ready","bg-green-50 border-green-100"],
              ["Staff Attendance Report","Apr 2026","Ready","bg-green-50 border-green-100"],
              ["Patient Statistics","Apr 2026","Ready","bg-green-50 border-green-100"],
              ["Department Performance","Q1 2026","Ready","bg-green-50 border-green-100"],
              ["Compliance Audit Report","Mar 2026","Pending","bg-yellow-50 border-yellow-100"],
              ["Annual Budget Review","2026","In Progress","bg-blue-50 border-blue-100"],
            ].map(([title,period,status,cls])=>(
              <div key={title as string} className={`rounded-xl border p-4 ${cls}`}>
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
