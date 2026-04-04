"use client";
import { useState, ReactNode, useCallback, useEffect, createContext, useContext, useRef } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import UserProfile from "@/components/profile/UserProfile";

// ── Toast system ──────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";
interface Toast { id: number; message: string; type: ToastType }

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counter.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const COLORS: Record<ToastType, string> = {
    success: "bg-green-600", error: "bg-red-600", info: "bg-blue-600", warning: "bg-yellow-500",
  };
  const ICONS: Record<ToastType, string> = {
    success: "✓", error: "✕", info: "ℹ", warning: "⚠",
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] max-w-sm animate-slide-in ${COLORS[t.type]}`}>
            <span className="text-base leading-none">{ICONS[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const useToast = () => useContext(ToastContext);

// ── Notification bell ─────────────────────────────────────────────────────────
interface Notification { id: number; message: string; time: string; read: boolean; type: string }

function NotificationBell({ notifications, onRead }: { notifications: Notification[]; onRead: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const TYPE_COLORS: Record<string, string> = { payment:"bg-green-100 text-green-700", appointment:"bg-blue-100 text-blue-700", alert:"bg-red-100 text-red-700", info:"bg-gray-100 text-gray-700" };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <span className="font-semibold text-gray-800 text-sm">Notifications</span>
            {unread > 0 && <span className="text-xs text-blue-600 font-medium">{unread} unread</span>}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => onRead(n.id)}
                className={`px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50" : ""}`}>
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${TYPE_COLORS[n.type] || "bg-gray-100 text-gray-700"}`}>{n.type}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-medium text-gray-900" : "text-gray-600"}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t bg-gray-50">
            <button onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const NAV = [
  { id: "overview",     label: "Overview",       icon: "📊" },
  { id: "users",        label: "User Management", icon: "👥" },
  { id: "staff",        label: "Medical Staff",   icon: "🩺" },
  { id: "patients",     label: "Patients",        icon: "🏥" },
  { id: "appointments", label: "Appointments",    icon: "📅" },
  { id: "billing",      label: "Billing",         icon: "💰" },
  { id: "reports",      label: "Reports",         icon: "📈" },
  { id: "settings",     label: "System Settings", icon: "⚙️" },
  { id: "audit",        label: "Audit Logs",      icon: "🔍" },
  { id: "profile",      label: "My Profile",      icon: "👤" },
];

// ── Reusable UI ───────────────────────────────────────────────────────────────
const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const SearchBar = ({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) => (
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose }: { message: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal title="Confirm Action" onClose={onClose}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Confirm</button>
      </div>
    </Modal>
  );
}

// ── Form field helpers ────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);
const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const FormActions = ({ onCancel, submitLabel = "Save" }: { onCancel: () => void; submitLabel?: string }) => (
  <div className="flex gap-3 justify-end pt-4 border-t mt-4">
    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
    <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{submitLabel}</button>
  </div>
);

// ── Types ─────────────────────────────────────────────────────────────────────
type User = { id: number; name: string; email: string; role: string; status: string; joined: string };
type Staff = { id: number; name: string; type: string; specialty: string; department: string; status: string; license: string };
type Patient = { id: string; name: string; sex: string; age: string; blood: string; condition: string; status: string; doctor: string; phone: string };
type Appointment = { id: string; patient: string; doctor: string; date: string; time: string; reason: string; status: string };
type Bill = { id: string; patient: string; description: string; amount: string; status: string; date: string; method: string };

// ── Initial data ──────────────────────────────────────────────────────────────
const INIT_USERS: User[] = [
  { id:1, name:"Linda Nekesa",   email:"erimalinda26@gmail.com",  role:"ADMIN",              status:"Active", joined:"Apr 1, 2026" },
  { id:2, name:"James Omondi",   email:"management@medicare.com", role:"HOSPITAL_MANAGEMENT",status:"Active", joined:"Mar 15, 2026" },
  { id:3, name:"Dr. Sarah J.",   email:"doctor@medicare.com",     role:"MEDICAL_STAFF",      status:"Active", joined:"Mar 10, 2026" },
  { id:4, name:"Emma Wilson",    email:"nurse@medicare.com",      role:"MEDICAL_STAFF",      status:"Active", joined:"Mar 10, 2026" },
  { id:5, name:"John Doe",       email:"patient@medicare.com",    role:"PATIENT",            status:"Active", joined:"Feb 28, 2026" },
  { id:6, name:"Mary Caregiver", email:"caregiver@medicare.com",  role:"CAREGIVER",          status:"Active", joined:"Feb 20, 2026" },
];

const INIT_STAFF: Staff[] = [
  { id:1, name:"Dr. Sarah Johnson",  type:"DOCTOR",       specialty:"Cardiology",      department:"Cardiology",          status:"Active",   license:"KMB-1234" },
  { id:2, name:"Emma Wilson",        type:"NURSE",        specialty:"General",         department:"Ward / Nursing",       status:"Active",   license:"KNB-5678" },
  { id:3, name:"Dr. Peter Kamau",    type:"DOCTOR",       specialty:"General Medicine",department:"General Medicine",     status:"Active",   license:"KMB-2345" },
  { id:4, name:"Kevin Otieno",       type:"LAB_TECH",     specialty:"Haematology",     department:"Laboratory / Pathology",status:"Active",  license:"KLB-3456" },
  { id:5, name:"Grace Mwangi",       type:"PHARMACIST",   specialty:"Clinical Pharmacy",department:"Pharmacy",           status:"Active",   license:"KPB-4567" },
  { id:6, name:"Dr. Achieng Otieno", type:"SURGEON",      specialty:"General Surgery", department:"General Surgery",      status:"Active",   license:"KMB-6789" },
  { id:7, name:"Faith Wanjiku",      type:"MIDWIFE",      specialty:"Obstetrics",      department:"Gynaecology & Obstetrics",status:"Active",license:"KNB-7890" },
  { id:8, name:"James Kariuki",      type:"RADIOGRAPHER", specialty:"Diagnostic",      department:"Radiology & Imaging",  status:"On Leave", license:"KRB-8901" },
];

const INIT_PATIENTS: Patient[] = [
  { id:"P-001", name:"John Doe",     sex:"M", age:"39", blood:"O+",  condition:"Hypertension",       status:"Active",     doctor:"Dr. Sarah J.", phone:"0733333333" },
  { id:"P-002", name:"Jane Smith",   sex:"F", age:"34", blood:"A+",  condition:"Diabetes Type 2",    status:"Active",     doctor:"Dr. Kamau",    phone:"0744444444" },
  { id:"P-003", name:"Ali Hassan",   sex:"M", age:"47", blood:"B+",  condition:"Cardiac Arrhythmia", status:"Admitted",   doctor:"Dr. Sarah J.", phone:"0755000001" },
  { id:"P-004", name:"Mary Wanjiku", sex:"F", age:"25", blood:"AB+", condition:"Prenatal Care",      status:"Active",     doctor:"Dr. Achieng",  phone:"0755000002" },
  { id:"P-005", name:"Peter Mwangi", sex:"M", age:"62", blood:"O-",  condition:"Knee Replacement",   status:"Post-Op",    doctor:"Dr. Achieng",  phone:"0766000001" },
  { id:"P-006", name:"Grace Otieno", sex:"F", age:"18", blood:"A-",  condition:"Asthma",             status:"Active",     doctor:"Dr. Kamau",    phone:"0766000002" },
  { id:"P-007", name:"Samuel Kibet", sex:"M", age:"55", blood:"B-",  condition:"Renal Failure",      status:"Critical",   doctor:"Dr. Sarah J.", phone:"0777000001" },
  { id:"P-008", name:"Fatuma Abdi",  sex:"F", age:"29", blood:"AB-", condition:"Maternity",          status:"Discharged", doctor:"Dr. Achieng",  phone:"0777000002" },
];

const INIT_APPTS: Appointment[] = [
  { id:"APT-001", patient:"John Doe",     doctor:"Dr. Sarah J.", date:"Apr 1, 2026", time:"09:00", reason:"Cardiology Review",  status:"CONFIRMED" },
  { id:"APT-002", patient:"Jane Smith",   doctor:"Dr. Kamau",    date:"Apr 1, 2026", time:"10:30", reason:"Diabetes Follow-up", status:"PENDING" },
  { id:"APT-003", patient:"Ali Hassan",   doctor:"Dr. Sarah J.", date:"Apr 1, 2026", time:"11:00", reason:"ECG Review",         status:"CONFIRMED" },
  { id:"APT-004", patient:"Mary Wanjiku", doctor:"Dr. Achieng",  date:"Apr 2, 2026", time:"08:00", reason:"Antenatal Visit",    status:"CONFIRMED" },
  { id:"APT-005", patient:"Peter Mwangi", doctor:"Dr. Achieng",  date:"Apr 2, 2026", time:"14:00", reason:"Post-Op Check",      status:"PENDING" },
  { id:"APT-006", patient:"Grace Otieno", doctor:"Dr. Kamau",    date:"Apr 3, 2026", time:"09:30", reason:"Asthma Review",      status:"CANCELLED" },
  { id:"APT-007", patient:"Samuel Kibet", doctor:"Dr. Sarah J.", date:"Apr 3, 2026", time:"11:00", reason:"Dialysis",           status:"COMPLETED" },
];

const INIT_BILLS: Bill[] = [
  { id:"INV-001", patient:"John Doe",     description:"Consultation",       amount:"2500",  status:"PAID",    date:"Apr 1, 2026",  method:"M-Pesa" },
  { id:"INV-002", patient:"Jane Smith",   description:"Lab Tests",          amount:"4800",  status:"PAID",    date:"Mar 30, 2026", method:"Cash" },
  { id:"INV-003", patient:"Ali Hassan",   description:"ECG + Consultation", amount:"6200",  status:"UNPAID",  date:"Apr 1, 2026",  method:"" },
  { id:"INV-004", patient:"Mary Wanjiku", description:"Antenatal Package",  amount:"12000", status:"PARTIAL", date:"Apr 2, 2026",  method:"Insurance" },
  { id:"INV-005", patient:"Peter Mwangi", description:"Surgery",            amount:"85000", status:"UNPAID",  date:"Apr 2, 2026",  method:"" },
  { id:"INV-006", patient:"Grace Otieno", description:"Consultation",       amount:"2500",  status:"PAID",    date:"Mar 28, 2026", method:"M-Pesa" },
  { id:"INV-007", patient:"Samuel Kibet", description:"Dialysis x3",        amount:"45000", status:"PARTIAL", date:"Apr 3, 2026",  method:"Insurance" },
];

const ROLE_COLORS: Record<string,string> = {
  ADMIN:"bg-slate-100 text-slate-700", HOSPITAL_MANAGEMENT:"bg-blue-100 text-blue-700",
  MEDICAL_STAFF:"bg-green-100 text-green-700", PATIENT:"bg-purple-100 text-purple-700",
  CAREGIVER:"bg-orange-100 text-orange-700", INSURANCE:"bg-pink-100 text-pink-700",
  GOVERNMENT:"bg-teal-100 text-teal-700",
};
const STATUS_COLORS: Record<string,string> = {
  Active:"bg-green-100 text-green-700", Admitted:"bg-blue-100 text-blue-700",
  "Post-Op":"bg-purple-100 text-purple-700", Critical:"bg-red-100 text-red-700",
  Discharged:"bg-gray-100 text-gray-600", "On Leave":"bg-yellow-100 text-yellow-700",
};
const APPT_COLORS: Record<string,string> = {
  CONFIRMED:"bg-green-100 text-green-700", PENDING:"bg-yellow-100 text-yellow-700",
  CANCELLED:"bg-red-100 text-red-700", COMPLETED:"bg-blue-100 text-blue-700",
};
const BILL_COLORS: Record<string,string> = {
  PAID:"bg-green-100 text-green-700", UNPAID:"bg-red-100 text-red-700", PARTIAL:"bg-yellow-100 text-yellow-700",
};

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<User[]>(INIT_USERS);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add"|"edit"|"view"|"delete"|null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState({ name:"", email:"", role:"PATIENT", status:"Active" });

  const open = (m: typeof modal, u?: User) => {
    setSelected(u || null);
    if (u) setForm({ name:u.name, email:u.email, role:u.role, status:u.status });
    else setForm({ name:"", email:"", role:"PATIENT", status:"Active" });
    setModal(m);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === "add") {
      setUsers(prev => [...prev, { id: Date.now(), ...form, joined: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) }]);
    } else if (modal === "edit" && selected) {
      setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, ...form } : u));
    }
    setModal(null);
  };

  const del = () => { setUsers(prev => prev.filter(u => u.id !== selected!.id)); };
  const filtered = users.filter(u => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      {modal === "view" && selected && (
        <Modal title="User Details" onClose={() => setModal(null)}>
          <div className="space-y-3 text-sm">
            {[["Name",selected.name],["Email",selected.email],["Role",selected.role],["Status",selected.status],["Joined",selected.joined]].map(([k,v])=>(
              <div key={k} className="flex justify-between border-b pb-2"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => open("edit", selected)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Edit</button>
            <button onClick={() => open("delete", selected)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Delete</button>
          </div>
        </Modal>
      )}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add New User" : "Edit User"} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Full Name"><Input required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Jane Doe" /></Field>
            <Field label="Email"><Input required type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="jane@example.com" /></Field>
            <Field label="Role"><Select value={form.role} onChange={v=>setForm(f=>({...f,role:v}))} options={["ADMIN","HOSPITAL_MANAGEMENT","MEDICAL_STAFF","PATIENT","CAREGIVER","INSURANCE","GOVERNMENT"]} /></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["Active","Inactive","Suspended"]} /></Field>
            <FormActions onCancel={() => setModal(null)} submitLabel={modal === "add" ? "Add User" : "Save Changes"} />
          </form>
        </Modal>
      )}
      {modal === "delete" && selected && (
        <ConfirmModal message={`Delete user "${selected.name}"? This cannot be undone.`} onConfirm={del} onClose={() => setModal(null)} />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">User Management <span className="text-sm font-normal text-gray-400 ml-1">({users.length} users)</span></h2>
        <button onClick={() => open("add")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add User</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b"><SearchBar placeholder="Search users..." value={search} onChange={setSearch} /></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">{["Name","Email","Role","Status","Joined","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><Badge label={u.role.replace(/_/g," ")} color={ROLE_COLORS[u.role]||"bg-gray-100 text-gray-700"} /></td>
                  <td className="px-4 py-3"><Badge label={u.status} color={u.status==="Active"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"} /></td>
                  <td className="px-4 py-3 text-gray-400">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open("view",u)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md font-medium">View</button>
                      <button onClick={() => open("edit",u)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 py-1 rounded-md font-medium">Edit</button>
                      <button onClick={() => open("delete",u)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-md font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-gray-400">No users found</p>}
        </div>
      </div>
    </div>
  );
}

// ── Staff Tab ─────────────────────────────────────────────────────────────────
function StaffTab() {
  const [staff, setStaff] = useState<Staff[]>(INIT_STAFF);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add"|"edit"|"view"|"delete"|null>(null);
  const [selected, setSelected] = useState<Staff | null>(null);
  const [form, setForm] = useState({ name:"", type:"DOCTOR", specialty:"", department:"", status:"Active", license:"" });

  const open = (m: typeof modal, s?: Staff) => {
    setSelected(s||null);
    if (s) setForm({ name:s.name, type:s.type, specialty:s.specialty, department:s.department, status:s.status, license:s.license });
    else setForm({ name:"", type:"DOCTOR", specialty:"", department:"", status:"Active", license:"" });
    setModal(m);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === "add") setStaff(p => [...p, { id: Date.now(), ...form }]);
    else if (modal === "edit" && selected) setStaff(p => p.map(s => s.id === selected.id ? { ...s, ...form } : s));
    setModal(null);
  };
  const del = () => setStaff(p => p.filter(s => s.id !== selected!.id));
  const filtered = staff.filter(s => `${s.name} ${s.type} ${s.department}`.toLowerCase().includes(search.toLowerCase()));
  const TYPE_COLORS: Record<string,string> = { DOCTOR:"bg-blue-100 text-blue-700", NURSE:"bg-green-100 text-green-700", LAB_TECH:"bg-yellow-100 text-yellow-700", PHARMACIST:"bg-purple-100 text-purple-700", SURGEON:"bg-red-100 text-red-700", MIDWIFE:"bg-pink-100 text-pink-700", RADIOGRAPHER:"bg-indigo-100 text-indigo-700" };

  return (
    <div className="space-y-4">
      {modal === "view" && selected && (
        <Modal title="Staff Details" onClose={() => setModal(null)}>
          <div className="space-y-3 text-sm">
            {[["Name",selected.name],["Type",selected.type],["Specialty",selected.specialty],["Department",selected.department],["License No.",selected.license],["Status",selected.status]].map(([k,v])=>(
              <div key={k} className="flex justify-between border-b pb-2"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => open("edit",selected)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Edit</button>
            <button onClick={() => open("delete",selected)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Delete</button>
          </div>
        </Modal>
      )}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Medical Staff" : "Edit Staff"} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Full Name"><Input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Dr. Jane Doe" /></Field>
            <Field label="Staff Type"><Select value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={["DOCTOR","SURGEON","NURSE","MIDWIFE","LAB_TECH","PHARMACIST","RADIOGRAPHER","PHYSIOTHERAPIST","CLINICAL_OFFICER","RECEPTIONIST"]} /></Field>
            <Field label="Specialty"><Input value={form.specialty} onChange={e=>setForm(f=>({...f,specialty:e.target.value}))} placeholder="e.g. Cardiology" /></Field>
            <Field label="Department"><Input value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))} placeholder="e.g. Cardiology" /></Field>
            <Field label="License No."><Input value={form.license} onChange={e=>setForm(f=>({...f,license:e.target.value}))} placeholder="e.g. KMB-1234" /></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["Active","On Leave","Inactive"]} /></Field>
            <FormActions onCancel={() => setModal(null)} submitLabel={modal === "add" ? "Add Staff" : "Save Changes"} />
          </form>
        </Modal>
      )}
      {modal === "delete" && selected && <ConfirmModal message={`Remove "${selected.name}" from staff?`} onConfirm={del} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Medical Staff <span className="text-sm font-normal text-gray-400 ml-1">({staff.length})</span></h2>
        <button onClick={() => open("add")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Staff</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b"><SearchBar placeholder="Search staff..." value={search} onChange={setSearch} /></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">{["Name","Type","Specialty","Department","License","Status","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3"><Badge label={s.type.replace(/_/g," ")} color={TYPE_COLORS[s.type]||"bg-gray-100 text-gray-700"} /></td>
                  <td className="px-4 py-3 text-gray-500">{s.specialty}</td>
                  <td className="px-4 py-3 text-gray-500">{s.department}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.license}</td>
                  <td className="px-4 py-3"><Badge label={s.status} color={STATUS_COLORS[s.status]||"bg-gray-100 text-gray-700"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open("view",s)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md font-medium">View</button>
                      <button onClick={() => open("edit",s)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 py-1 rounded-md font-medium">Edit</button>
                      <button onClick={() => open("delete",s)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-md font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Patients Tab ──────────────────────────────────────────────────────────────
function PatientsTab() {
  const [patients, setPatients] = useState<Patient[]>(INIT_PATIENTS);
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<"add"|"edit"|"view"|"delete"|null>(null);
  const [selected, setSelected] = useState<Patient|null>(null);
  const [form, setForm] = useState({ name:"", sex:"M", age:"", blood:"O+", condition:"", status:"Active", doctor:"", phone:"" });

  const open = (m: typeof modal, p?: Patient) => {
    setSelected(p||null);
    if (p) setForm({ name:p.name, sex:p.sex, age:p.age, blood:p.blood, condition:p.condition, status:p.status, doctor:p.doctor, phone:p.phone });
    else setForm({ name:"", sex:"M", age:"", blood:"O+", condition:"", status:"Active", doctor:"", phone:"" });
    setModal(m);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `P-${String(patients.length+1).padStart(3,"0")}`;
    if (modal === "add") setPatients(p => [...p, { id, ...form }]);
    else if (modal === "edit" && selected) setPatients(p => p.map(x => x.id === selected.id ? { ...x, ...form } : x));
    setModal(null);
  };
  const del = () => setPatients(p => p.filter(x => x.id !== selected!.id));
  const statuses = ["All","Active","Admitted","Post-Op","Critical","Discharged"];
  const filtered = patients.filter(p => (filter==="All"||p.status===filter) && `${p.name} ${p.condition} ${p.doctor}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      {modal === "view" && selected && (
        <Modal title="Patient Details" onClose={() => setModal(null)}>
          <div className="space-y-3 text-sm">
            {[["Patient ID",selected.id],["Name",selected.name],["Sex",selected.sex],["Age",selected.age],["Blood Type",selected.blood],["Condition",selected.condition],["Status",selected.status],["Doctor",selected.doctor],["Phone",selected.phone]].map(([k,v])=>(
              <div key={k} className="flex justify-between border-b pb-2"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => open("edit",selected)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Edit</button>
            <button onClick={() => open("delete",selected)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Delete</button>
          </div>
        </Modal>
      )}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Register Patient" : "Edit Patient"} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Full Name"><Input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="John Doe" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sex"><Select value={form.sex} onChange={v=>setForm(f=>({...f,sex:v}))} options={["M","F"]} /></Field>
              <Field label="Age"><Input required type="number" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))} placeholder="35" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Blood Type"><Select value={form.blood} onChange={v=>setForm(f=>({...f,blood:v}))} options={["O+","O-","A+","A-","B+","B-","AB+","AB-"]} /></Field>
              <Field label="Status"><Select value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["Active","Admitted","Post-Op","Critical","Discharged"]} /></Field>
            </div>
            <Field label="Condition / Diagnosis"><Input required value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))} placeholder="e.g. Hypertension" /></Field>
            <Field label="Assigned Doctor"><Input value={form.doctor} onChange={e=>setForm(f=>({...f,doctor:e.target.value}))} placeholder="Dr. Sarah J." /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="0700000000" /></Field>
            <FormActions onCancel={() => setModal(null)} submitLabel={modal === "add" ? "Register" : "Save Changes"} />
          </form>
        </Modal>
      )}
      {modal === "delete" && selected && <ConfirmModal message={`Delete patient record for "${selected.name}"?`} onConfirm={del} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Patients <span className="text-sm font-normal text-gray-400 ml-1">({patients.length})</span></h2>
        <button onClick={() => open("add")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Register Patient</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchBar placeholder="Search patients..." value={search} onChange={setSearch} /></div>
          <div className="flex gap-1 flex-wrap">{statuses.map(s=><button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">{["ID","Name","Sex","Age","Blood","Condition","Status","Doctor","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.sex}</td>
                  <td className="px-4 py-3 text-gray-500">{p.age}</td>
                  <td className="px-4 py-3 text-gray-500">{p.blood}</td>
                  <td className="px-4 py-3 text-gray-500">{p.condition}</td>
                  <td className="px-4 py-3"><Badge label={p.status} color={STATUS_COLORS[p.status]||"bg-gray-100 text-gray-600"} /></td>
                  <td className="px-4 py-3 text-gray-500">{p.doctor}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open("view",p)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md font-medium">View</button>
                      <button onClick={() => open("edit",p)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 py-1 rounded-md font-medium">Edit</button>
                      <button onClick={() => open("delete",p)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-md font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-gray-400">No patients found</p>}
        </div>
      </div>
    </div>
  );
}

// ── Appointments Tab ──────────────────────────────────────────────────────────
function AppointmentsTab() {
  const [appts, setAppts] = useState<Appointment[]>(INIT_APPTS);
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<"add"|"edit"|"view"|"delete"|null>(null);
  const [selected, setSelected] = useState<Appointment|null>(null);
  const [form, setForm] = useState({ patient:"", doctor:"", date:"", time:"", reason:"", status:"PENDING" });

  const open = (m: typeof modal, a?: Appointment) => {
    setSelected(a||null);
    if (a) setForm({ patient:a.patient, doctor:a.doctor, date:a.date, time:a.time, reason:a.reason, status:a.status });
    else setForm({ patient:"", doctor:"", date:"", time:"", reason:"", status:"PENDING" });
    setModal(m);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `APT-${String(appts.length+1).padStart(3,"0")}`;
    if (modal === "add") setAppts(p => [...p, { id, ...form }]);
    else if (modal === "edit" && selected) setAppts(p => p.map(x => x.id === selected.id ? { ...x, ...form } : x));
    setModal(null);
  };
  const del = () => setAppts(p => p.filter(x => x.id !== selected!.id));
  const statuses = ["All","CONFIRMED","PENDING","CANCELLED","COMPLETED"];
  const filtered = appts.filter(a => (filter==="All"||a.status===filter) && `${a.patient} ${a.doctor} ${a.reason}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      {modal === "view" && selected && (
        <Modal title="Appointment Details" onClose={() => setModal(null)}>
          <div className="space-y-3 text-sm">
            {[["ID",selected.id],["Patient",selected.patient],["Doctor",selected.doctor],["Date",selected.date],["Time",selected.time],["Reason",selected.reason],["Status",selected.status]].map(([k,v])=>(
              <div key={k} className="flex justify-between border-b pb-2"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => open("edit",selected)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Edit</button>
            <button onClick={() => open("delete",selected)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Cancel Appt.</button>
          </div>
        </Modal>
      )}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Appointment" : "Edit Appointment"} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Patient Name"><Input required value={form.patient} onChange={e=>setForm(f=>({...f,patient:e.target.value}))} placeholder="John Doe" /></Field>
            <Field label="Doctor"><Input required value={form.doctor} onChange={e=>setForm(f=>({...f,doctor:e.target.value}))} placeholder="Dr. Sarah J." /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date"><Input required type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></Field>
              <Field label="Time"><Input required type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} /></Field>
            </div>
            <Field label="Reason"><Input required value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} placeholder="e.g. Cardiology Review" /></Field>
            <Field label="Status"><Select value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["PENDING","CONFIRMED","COMPLETED","CANCELLED","NO_SHOW"]} /></Field>
            <FormActions onCancel={() => setModal(null)} submitLabel={modal === "add" ? "Book Appointment" : "Save Changes"} />
          </form>
        </Modal>
      )}
      {modal === "delete" && selected && <ConfirmModal message={`Cancel appointment ${selected.id} for ${selected.patient}?`} onConfirm={del} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Appointments <span className="text-sm font-normal text-gray-400 ml-1">({appts.length})</span></h2>
        <button onClick={() => open("add")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ New Appointment</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchBar placeholder="Search appointments..." value={search} onChange={setSearch} /></div>
          <div className="flex gap-1 flex-wrap">{statuses.map(s=><button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">{["ID","Patient","Doctor","Date","Time","Reason","Status","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{a.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{a.patient}</td>
                  <td className="px-4 py-3 text-gray-500">{a.doctor}</td>
                  <td className="px-4 py-3 text-gray-500">{a.date}</td>
                  <td className="px-4 py-3 text-gray-500">{a.time}</td>
                  <td className="px-4 py-3 text-gray-500">{a.reason}</td>
                  <td className="px-4 py-3"><Badge label={a.status} color={APPT_COLORS[a.status]||"bg-gray-100 text-gray-600"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open("view",a)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md font-medium">View</button>
                      <button onClick={() => open("edit",a)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 py-1 rounded-md font-medium">Edit</button>
                      <button onClick={() => open("delete",a)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-md font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Billing Tab ───────────────────────────────────────────────────────────────
function BillingTab() {
  const toast = useToast();
  const [bills, setBills] = useState<Bill[]>(INIT_BILLS);
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<"add"|"edit"|"view"|"delete"|"pay"|null>(null);
  const [selected, setSelected] = useState<Bill|null>(null);
  const [form, setForm] = useState({ patient:"", description:"", amount:"", status:"UNPAID", date:"", method:"" });
  const [payMethod, setPayMethod] = useState("M-Pesa");

  const open = (m: typeof modal, b?: Bill) => {
    setSelected(b||null);
    if (b) setForm({ patient:b.patient, description:b.description, amount:b.amount, status:b.status, date:b.date, method:b.method });
    else setForm({ patient:"", description:"", amount:"", status:"UNPAID", date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), method:"" });
    setModal(m);
  };

  // Auto-mark PAID when payment method is selected in the form
  const handleMethodChange = (v: string) => {
    setForm(f => ({ ...f, method: v, status: v ? "PAID" : f.status }));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `INV-${String(bills.length+1).padStart(3,"0")}`;
    if (modal === "add") {
      setBills(p => [...p, { id, ...form }]);
      toast(`Invoice ${id} created`, "success");
    } else if (modal === "edit" && selected) {
      const wasPaid = selected.status !== "PAID" && form.status === "PAID";
      setBills(p => p.map(x => x.id === selected.id ? { ...x, ...form } : x));
      if (wasPaid) toast(`Payment recorded for ${selected.patient} — KES ${Number(form.amount).toLocaleString()}`, "success");
      else toast("Invoice updated", "info");
    }
    setModal(null);
  };

  const del = () => {
    setBills(p => p.filter(x => x.id !== selected!.id));
    toast(`Invoice ${selected!.id} deleted`, "warning");
  };

  const markPaid = (id: string, method = "Cash") => {
    const bill = bills.find(b => b.id === id);
    setBills(p => p.map(x => x.id === id ? { ...x, status:"PAID", method } : x));
    if (bill) toast(`Payment of KES ${Number(bill.amount).toLocaleString()} received from ${bill.patient}`, "success");
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) markPaid(selected.id, payMethod);
    setModal(null);
  };

  const statuses = ["All","PAID","UNPAID","PARTIAL"];
  const filtered = bills.filter(b => (filter==="All"||b.status===filter) && `${b.patient} ${b.description}`.toLowerCase().includes(search.toLowerCase()));
  const total = bills.reduce((s,b)=>s+Number(b.amount),0);
  const paid = bills.filter(b=>b.status==="PAID").reduce((s,b)=>s+Number(b.amount),0);

  return (
    <div className="space-y-4">
      {modal === "view" && selected && (
        <Modal title="Invoice Details" onClose={() => setModal(null)}>
          <div className="space-y-3 text-sm">
            {[["Invoice",selected.id],["Patient",selected.patient],["Description",selected.description],["Amount",`KES ${Number(selected.amount).toLocaleString()}`],["Status",selected.status],["Date",selected.date],["Payment Method",selected.method||"—"]].map(([k,v])=>(
              <div key={k} className="flex justify-between border-b pb-2"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900">{v}</span></div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => open("edit",selected)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Edit</button>
            {selected.status !== "PAID" && <button onClick={() => { setPayMethod("M-Pesa"); open("pay",selected); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">Record Payment</button>}
            <button onClick={() => open("delete",selected)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Delete</button>
          </div>
        </Modal>
      )}
      {modal === "pay" && selected && (
        <Modal title={`Record Payment — ${selected.id}`} onClose={() => setModal(null)}>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium text-gray-900">{selected.patient}</p>
            <p className="text-gray-500">{selected.description}</p>
            <p className="text-xl font-bold text-blue-700 mt-1">KES {Number(selected.amount).toLocaleString()}</p>
          </div>
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <Field label="Payment Method">
              <Select value={payMethod} onChange={setPayMethod} options={["M-Pesa","Cash","Insurance","Card","Bank Transfer"]} />
            </Field>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              ✓ Selecting a payment method will automatically mark this invoice as <strong>PAID</strong>.
            </div>
            <FormActions onCancel={() => setModal(null)} submitLabel="Confirm Payment" />
          </form>
        </Modal>
      )}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Invoice" : "Edit Invoice"} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Patient Name"><Input required value={form.patient} onChange={e=>setForm(f=>({...f,patient:e.target.value}))} placeholder="John Doe" /></Field>
            <Field label="Description"><Input required value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Consultation" /></Field>
            <Field label="Amount (KES)"><Input required type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="2500" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <Select value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["UNPAID","PAID","PARTIAL","WAIVED"]} />
              </Field>
              <Field label="Payment Method">
                <Select value={form.method} onChange={handleMethodChange} options={["","M-Pesa","Cash","Insurance","Card","Bank Transfer"]} />
              </Field>
            </div>
            {form.method && form.status === "PAID" && (
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                ✓ Payment method selected — status automatically set to PAID
              </div>
            )}
            <FormActions onCancel={() => setModal(null)} submitLabel={modal === "add" ? "Create Invoice" : "Save Changes"} />
          </form>
        </Modal>
      )}
      {modal === "delete" && selected && <ConfirmModal message={`Delete invoice ${selected.id}?`} onConfirm={del} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Billing & Payments</h2>
        <button onClick={() => open("add")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ New Invoice</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4"><p className="text-xs text-green-600 font-medium">Collected</p><p className="text-2xl font-bold text-green-700 mt-1">KES {paid.toLocaleString()}</p></div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4"><p className="text-xs text-red-600 font-medium">Outstanding</p><p className="text-2xl font-bold text-red-700 mt-1">KES {(total-paid).toLocaleString()}</p></div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"><p className="text-xs text-blue-600 font-medium">Total Invoiced</p><p className="text-2xl font-bold text-blue-700 mt-1">KES {total.toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchBar placeholder="Search invoices..." value={search} onChange={setSearch} /></div>
          <div className="flex gap-1">{statuses.map(s=><button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">{["Invoice","Patient","Description","Amount","Status","Date","Payment","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{b.patient}</td>
                  <td className="px-4 py-3 text-gray-500">{b.description}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">KES {Number(b.amount).toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge label={b.status} color={BILL_COLORS[b.status]||"bg-gray-100 text-gray-600"} /></td>
                  <td className="px-4 py-3 text-gray-400">{b.date}</td>
                  <td className="px-4 py-3 text-gray-500">{b.method||"—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open("view",b)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md font-medium">View</button>
                      <button onClick={() => open("edit",b)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 py-1 rounded-md font-medium">Edit</button>
                      {b.status !== "PAID" && <button onClick={() => { setPayMethod("M-Pesa"); open("pay",b); }} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2.5 py-1 rounded-md font-medium">Pay</button>}
                      <button onClick={() => open("delete",b)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-md font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Overview, Reports, Settings, Audit (unchanged but kept) ──────────────────
function OverviewTab({ setTab }: { setTab: (t: string) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="248" icon="👥" color="bg-slate-700" sub="+12 this month" />
        <StatCard label="Active Staff" value="42" icon="🩺" color="bg-blue-600" sub="8 departments" />
        <StatCard label="Patients" value="1,204" icon="🏥" color="bg-green-600" sub="94 new this week" />
        <StatCard label="Today's Appointments" value="38" icon="📅" color="bg-purple-600" sub="6 pending" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Patients","patients","🏥","bg-green-50 border-green-100 text-green-700"],["Staff","staff","🩺","bg-blue-50 border-blue-100 text-blue-700"],["Appointments","appointments","📅","bg-purple-50 border-purple-100 text-purple-700"],["Billing","billing","💰","bg-yellow-50 border-yellow-100 text-yellow-700"]].map(([label,id,icon,cls])=>(
          <button key={id} onClick={() => setTab(id)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
            <div className="text-2xl mb-1">{icon}</div>
            <p className="font-semibold text-sm">Manage {label}</p>
            <p className="text-xs opacity-70 mt-0.5">View, add, edit, delete →</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
          {[["🟢","New patient registered — John Doe"],["🔵","Appointment confirmed — Dr. Smith"],["🟡","Bill paid — KES 4,500"],["🟢","Staff account created — Nurse Mary"],["🔴","Appointment cancelled — Jane W."]].map(([dot,text],i)=>(
            <div key={i} className="flex items-start gap-2 py-1.5 border-b last:border-0 text-sm text-gray-600"><span className="text-xs mt-0.5">{dot}</span>{text}</div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-3">System Health</h3>
          {[["Database","Online","bg-green-500"],["API Server","Online","bg-green-500"],["Auth Service","Online","bg-green-500"],["Backup","2h ago","bg-yellow-500"],["Storage","68% used","bg-blue-500"]].map(([k,v,c])=>(
            <div key={k} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
              <span className="text-gray-600">{k}</span>
              <span className="flex items-center gap-1.5 font-medium text-gray-800"><span className={`w-2 h-2 rounded-full ${c}`} />{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0 text-right">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value/max)*100}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-10">{value}</span>
    </div>
  );
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900">Reports & Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value="KES 2.4M" icon="💰" color="bg-green-600" sub="↑ 18%" />
        <StatCard label="New Patients" value="94" icon="🏥" color="bg-blue-600" sub="This month" />
        <StatCard label="Appointments" value="312" icon="📅" color="bg-purple-600" sub="This month" />
        <StatCard label="Avg. Wait Time" value="18 min" icon="⏱️" color="bg-orange-500" sub="↓ 3 min" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-4">Patients by Department</h3>
          <div className="space-y-3">{[["Cardiology",312],["General Medicine",280],["Paediatrics",198],["Surgery",145],["Gynaecology",132],["Laboratory",98]].map(([l,v])=><Bar key={l} label={l as string} value={v as number} max={312} color="bg-blue-500" />)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue by Service (KES 000s)</h3>
          <div className="space-y-3">{[["Consultations",840],["Procedures",1100],["Lab Tests",460],["Pharmacy",320],["Radiology",280],["Maternity",200]].map(([l,v])=><Bar key={l} label={l as string} value={v as number} max={1100} color="bg-green-500" />)}</div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const toast = useToast();
  const STORAGE_KEY = "medicare_settings";

  const defaults = { hospitalName:"Medicare Hospital", email:"admin@medicare.com", phone:"+254 700 000 000", address:"Nairobi, Kenya", appointmentDuration:"30", maxPerDay:"50", emailNotifications:true, smsNotifications:false, twoFactor:false };

  const [s, setS] = useState(() => {
    if (typeof window === "undefined") return defaults;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch { return defaults; }
  });

  type SettingsState = typeof s;
  const Toggle = ({ k }: { k: keyof SettingsState }) => (
    <button onClick={() => setS((prev: SettingsState) => ({ ...prev, [k]: !prev[k] }))} className={`relative w-10 h-5 rounded-full transition-colors ${s[k]?"bg-blue-600":"bg-gray-300"}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s[k]?"translate-x-5":"translate-x-0.5"}`} />
    </button>
  );

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      toast("Settings saved successfully", "success");
    } catch {
      toast("Failed to save settings", "error");
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900">System Settings</h2>
      <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
        <h3 className="font-semibold text-gray-800 border-b pb-2">Hospital Information</h3>
        {[["Hospital Name","hospitalName","text"],["Contact Email","email","email"],["Phone Number","phone","tel"],["Address","address","text"]].map(([label,key,type])=>(
          <div key={key} className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm text-gray-600">{label}</label>
            <input type={type} value={s[key as keyof typeof s] as string} onChange={e=>setS((x: typeof defaults)=>({...x,[key]:e.target.value}))}
              className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
        <h3 className="font-semibold text-gray-800 border-b pb-2">Appointment Settings</h3>
        {[["Appointment Duration (min)","appointmentDuration"],["Max Appointments / Day","maxPerDay"]].map(([label,key])=>(
          <div key={key} className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm text-gray-600">{label}</label>
            <input type="number" value={s[key as keyof typeof s] as string} onChange={e=>setS((x: typeof defaults)=>({...x,[key]:e.target.value}))}
              className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
        <h3 className="font-semibold text-gray-800 border-b pb-2">Notifications & Security</h3>
        {[["Email Notifications","emailNotifications"],["SMS Notifications","smsNotifications"],["Two-Factor Authentication","twoFactor"]].map(([label,key])=>(
          <div key={key} className="flex items-center justify-between"><span className="text-sm text-gray-700">{label}</span><Toggle k={key as keyof typeof s} /></div>
        ))}
      </div>
      <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        Save Settings
      </button>
    </div>
  );
}

function AuditTab() {
  const [search, setSearch] = useState("");
  const logs = [
    ["Apr 1, 2026 09:12","Linda Nekesa","LOGIN","User","Successful login"],
    ["Apr 1, 2026 09:15","Linda Nekesa","VIEW","Patients","Viewed patient list"],
    ["Apr 1, 2026 09:20","Dr. Sarah J.","UPDATE","Appointment","Confirmed APT-001"],
    ["Apr 1, 2026 10:05","Emma Wilson","CREATE","Patient","Registered Grace Otieno"],
    ["Apr 1, 2026 10:30","Linda Nekesa","UPDATE","User","Updated role for James Omondi"],
    ["Apr 1, 2026 11:00","Dr. Kamau","CREATE","Record","Added medical record for Jane Smith"],
    ["Apr 1, 2026 11:45","Linda Nekesa","DELETE","Appointment","Cancelled APT-006"],
    ["Apr 1, 2026 14:00","Kevin Otieno","CREATE","Lab Result","Uploaded CBC results"],
    ["Apr 1, 2026 15:30","Grace Mwangi","UPDATE","Billing","Marked INV-006 as PAID"],
    ["Apr 1, 2026 16:00","Linda Nekesa","LOGOUT","User","Session ended"],
  ];
  const ACTION_COLORS: Record<string,string> = { LOGIN:"bg-green-100 text-green-700", LOGOUT:"bg-gray-100 text-gray-600", CREATE:"bg-blue-100 text-blue-700", UPDATE:"bg-yellow-100 text-yellow-700", DELETE:"bg-red-100 text-red-700", VIEW:"bg-purple-100 text-purple-700" };
  const filtered = logs.filter(l => l.join(" ").toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Audit Logs</h2>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex gap-3 items-center">
          <div className="flex-1"><SearchBar placeholder="Search logs..." value={search} onChange={setSearch} /></div>
          <button className="text-sm text-blue-600 hover:underline shrink-0">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">{["Timestamp","User","Action","Resource","Details"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(([ts,user,action,resource,detail],i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{ts}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user}</td>
                  <td className="px-4 py-3"><Badge label={action} color={ACTION_COLORS[action]||"bg-gray-100 text-gray-600"} /></td>
                  <td className="px-4 py-3 text-gray-500">{resource}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [notifications, setNotifications] = useState<Notification[]>([
    { id:1, message:"New patient registered — John Doe", time:"2 min ago", read:false, type:"info" },
    { id:2, message:"Payment received — KES 4,500 from Jane Smith", time:"15 min ago", read:false, type:"payment" },
    { id:3, message:"Appointment confirmed — Dr. Sarah J. at 10:00", time:"1 hr ago", read:false, type:"appointment" },
    { id:4, message:"Lab results ready for Ali Hassan", time:"2 hrs ago", read:true, type:"info" },
    { id:5, message:"Critical patient alert — Samuel Kibet (ICU)", time:"3 hrs ago", read:true, type:"alert" },
  ]);

  const markRead = (id: number) => setNotifications(n => n.map(x => x.id === id ? { ...x, read:true } : x));

  const content: Record<string, ReactNode> = {
    overview:     <OverviewTab setTab={setTab} />,
    users:        <UsersTab />,
    staff:        <StaffTab />,
    patients:     <PatientsTab />,
    appointments: <AppointmentsTab />,
    billing:      <BillingTab />,
    reports:      <ReportsTab />,
    settings:     <SettingsTab />,
    audit:        <AuditTab />,
    profile:      <UserProfile />,
  };

  return (
    <ToastProvider>
      <DashboardShell
        title="Admin Panel"
        role="System Administrator"
        accentColor="bg-slate-800"
        icon="🔒"
        navItems={NAV}
        activeTab={tab}
        onTabChange={setTab}
        headerExtra={<NotificationBell notifications={notifications} onRead={markRead} />}
      >
        {content[tab]}
      </DashboardShell>
    </ToastProvider>
  );
}
