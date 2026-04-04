"use client";
import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import UserProfile from "@/components/profile/UserProfile";
import { appointments, prescriptions, bills, notifications, Appointment, Prescription, Bill } from "@/lib/store";

const NAV = [
  { id: "overview",      label: "My Health",       icon: "❤️" },
  { id: "appointments",  label: "Appointments",    icon: "📅" },
  { id: "records",       label: "Medical Records", icon: "📋" },
  { id: "prescriptions", label: "Prescriptions",   icon: "💊" },
  { id: "bills",         label: "Bills & Payments", icon: "💳" },
  { id: "profile",       label: "My Profile",      icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
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

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

const APPT_COLORS: Record<string,string> = { CONFIRMED:"bg-green-100 text-green-700", PENDING:"bg-yellow-100 text-yellow-700", COMPLETED:"bg-blue-100 text-blue-700", CANCELLED:"bg-red-100 text-red-700" };
const BILL_COLORS: Record<string,string> = { PAID:"bg-green-100 text-green-700", UNPAID:"bg-red-100 text-red-700", PARTIAL:"bg-yellow-100 text-yellow-700" };

export default function PatientDashboard() {
  const [tab, setTab] = useState("overview");
  const [userEmail, setUserEmail] = useState("john.doe@medicare.com");
  const [myAppts, setMyAppts] = useState<Appointment[]>([]);
  const [myRx, setMyRx] = useState<Prescription[]>([]);
  const [myBills, setMyBills] = useState<Bill[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState<Bill | null>(null);
  const [payMethod, setPayMethod] = useState("M-Pesa");
  const [toast, setToast] = useState("");
  const [bookForm, setBookForm] = useState({ doctor:"Dr. Sarah Johnson", specialty:"Cardiology", date:"", time:"09:00", reason:"" });

  const refresh = () => {
    const email = userEmail;
    setMyAppts(appointments.getByEmail(email));
    setMyRx(prescriptions.getByEmail(email));
    setMyBills(bills.getByEmail(email));
  };

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.email) setUserEmail(u.email);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { refresh(); }, [userEmail]);

  const bookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    appointments.add({ ...bookForm, patientName: userEmail.split("@")[0], patientEmail: userEmail, status:"PENDING", notes:"" });
    notifications.add({ userId: userEmail, message:`Appointment booked with ${bookForm.doctor} on ${bookForm.date}`, type:"appointment", read:false });
    setShowBookForm(false);
    setToast("Appointment booked successfully");
    setTimeout(() => setToast(""), 3000);
    refresh();
  };

  const payBill = () => {
    if (!showPayModal) return;
    bills.markPaid(showPayModal.id, payMethod);
    notifications.add({ userId: userEmail, message:`Payment of KES ${showPayModal.amount.toLocaleString()} confirmed via ${payMethod}`, type:"payment", read:false });
    setShowPayModal(null);
    setToast("Payment confirmed");
    setTimeout(() => setToast(""), 3000);
    refresh();
  };

  const cancelAppt = (id: string) => {
    appointments.update(id, { status:"CANCELLED" });
    setToast("Appointment cancelled");
    setTimeout(() => setToast(""), 3000);
    refresh();
  };

  const downloadRx = (rx: Prescription) => {
    const content = `PRESCRIPTION\n${"─".repeat(40)}\nPatient: ${rx.patientName}\nDoctor: ${rx.doctor}\nDate: ${rx.issued}\n\nMedication: ${rx.drug}\nDosage: ${rx.dose}\nQuantity: ${rx.qty}\n${rx.notes ? `\nNotes: ${rx.notes}` : ""}\n${"─".repeat(40)}\nMedicare Hospital System`;
    const blob = new Blob([content], { type:"text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `prescription-${rx.id}.txt`; a.click();
  };

  const upcoming = myAppts.filter(a => a.status !== "COMPLETED" && a.status !== "CANCELLED");
  const unpaidBills = myBills.filter(b => b.status !== "PAID");

  const RECORDS = [
    { id:"MR-001", date:"Mar 20, 2026", doctor:"Dr. Sarah Johnson", diagnosis:"Hypertension Stage 1", treatment:"Amlodipine 5mg OD", notes:"BP 145/95. Advised low-sodium diet." },
    { id:"MR-002", date:"Feb 10, 2026", doctor:"Dr. Peter Kamau",   diagnosis:"Type 2 Diabetes Mellitus", treatment:"Metformin 500mg BD", notes:"HbA1c 8.2%. Refer to dietitian." },
  ];

  return (
    <DashboardShell title="Patient Portal" role="Patient" accentColor="bg-green-600" icon="🏥" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {showBookForm && (
        <Modal title="Book Appointment" onClose={() => setShowBookForm(false)}>
          <form onSubmit={bookAppointment} className="space-y-4">
            <Field label="Doctor">
              <select className={inputCls} value={bookForm.doctor} onChange={e=>setBookForm(f=>({...f,doctor:e.target.value}))}>
                {["Dr. Sarah Johnson","Dr. Peter Kamau","Dr. Achieng Otieno","Dr. Faith Wanjiku"].map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Specialty"><input className={inputCls} value={bookForm.specialty} onChange={e=>setBookForm(f=>({...f,specialty:e.target.value}))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date"><input required type="date" className={inputCls} value={bookForm.date} onChange={e=>setBookForm(f=>({...f,date:e.target.value}))} /></Field>
              <Field label="Time"><input required type="time" className={inputCls} value={bookForm.time} onChange={e=>setBookForm(f=>({...f,time:e.target.value}))} /></Field>
            </div>
            <Field label="Reason for Visit"><textarea required className={inputCls} rows={2} value={bookForm.reason} onChange={e=>setBookForm(f=>({...f,reason:e.target.value}))} placeholder="Describe your symptoms or reason..." /></Field>
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={()=>setShowBookForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700">Book Appointment</button>
            </div>
          </form>
        </Modal>
      )}

      {showPayModal && (
        <Modal title="Make Payment" onClose={() => setShowPayModal(null)}>
          <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm">
            <p className="font-medium text-gray-900">{showPayModal.description}</p>
            <p className="text-2xl font-bold text-green-700 mt-1">KES {showPayModal.amount.toLocaleString()}</p>
          </div>
          <Field label="Payment Method">
            <select className={inputCls} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
              {["M-Pesa","Cash","Insurance","Card","Bank Transfer"].map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>setShowPayModal(null)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Cancel</button>
            <button onClick={payBill} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700">Confirm Payment</button>
          </div>
        </Modal>
      )}

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">My Health Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Upcoming Appointments" value={String(upcoming.length)} icon="📅" color="bg-green-600" />
            <StatCard label="Medical Records" value={String(RECORDS.length)} icon="📋" color="bg-blue-600" />
            <StatCard label="Active Prescriptions" value={String(myRx.filter(r=>r.status==="Active").length)} icon="💊" color="bg-purple-600" />
            <StatCard label="Pending Bills" value={String(unpaidBills.length)} icon="💳" color="bg-orange-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Appointments","appointments","📅","bg-blue-50 border-blue-100 text-blue-700"],["Medical Records","records","📋","bg-purple-50 border-purple-100 text-purple-700"],["Prescriptions","prescriptions","💊","bg-green-50 border-green-100 text-green-700"],["Bills","bills","💳","bg-orange-50 border-orange-100 text-orange-700"]].map(([label,id,icon,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          {upcoming.length > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">Next Appointment</h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="font-semibold text-gray-900">{upcoming[0].doctor}</p>
                <p className="text-sm text-gray-500">{upcoming[0].specialty} · {upcoming[0].reason}</p>
                <p className="text-sm font-medium text-green-700 mt-2">📅 {upcoming[0].date} · {upcoming[0].time}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Appointments ── */}
      {tab === "appointments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
            <button onClick={() => setShowBookForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">+ Book Appointment</button>
          </div>
          {myAppts.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p>No appointments yet</p>
              <button onClick={() => setShowBookForm(true)} className="mt-3 text-sm text-green-600 hover:underline">Book your first appointment</button>
            </div>
          ) : (
            <div className="space-y-3">
              {myAppts.map(a => (
                <div key={a.id} className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge label={a.status} color={APPT_COLORS[a.status]||"bg-gray-100 text-gray-700"} />
                        <span className="text-xs text-gray-400 font-mono">{a.id}</span>
                      </div>
                      <p className="font-semibold text-gray-900">{a.doctor}</p>
                      <p className="text-sm text-gray-600">{a.specialty} · {a.reason}</p>
                      <p className="text-sm font-medium text-blue-700 mt-1">📅 {a.date} · {a.time}</p>
                    </div>
                    {(a.status === "CONFIRMED" || a.status === "PENDING") && (
                      <button onClick={() => cancelAppt(a.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium shrink-0">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Medical Records ── */}
      {tab === "records" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Medical Records</h2>
          <div className="space-y-3">
            {RECORDS.map(r => (
              <div key={r.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedRecord(expandedRecord === r.id ? null : r.id)}>
                  <div>
                    <p className="font-semibold text-gray-900">{r.diagnosis}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.doctor} · {r.date}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{expandedRecord === r.id ? "▲" : "▼"}</span>
                </div>
                {expandedRecord === r.id && (
                  <div className="border-t bg-gray-50 p-4 space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Treatment: </span><span className="text-gray-600">{r.treatment}</span></div>
                    <div><span className="font-medium text-gray-700">Notes: </span><span className="text-gray-600">{r.notes}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Prescriptions ── */}
      {tab === "prescriptions" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Prescriptions</h2>
          {myRx.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border text-gray-400"><div className="text-4xl mb-3">💊</div><p>No prescriptions yet</p></div>
          ) : (
            <div className="space-y-3">
              {myRx.map(p => (
                <div key={p.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${p.status==="Active"?"border-green-500":"border-gray-300"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge label={p.status} color={p.status==="Active"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"} />
                        <span className="text-xs text-gray-400 font-mono">{p.id}</span>
                      </div>
                      <p className="font-semibold text-gray-900">{p.drug}</p>
                      <p className="text-sm text-gray-600">{p.dose}</p>
                      <p className="text-xs text-gray-400 mt-1">Qty: {p.qty} · Issued: {p.issued} · {p.doctor}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => downloadRx(p)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium">⬇ Download</button>
                      {p.status === "Active" && <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">Request Refill</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Bills ── */}
      {tab === "bills" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Bills & Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4"><p className="text-xs text-green-600 font-medium">Total Paid</p><p className="text-2xl font-bold text-green-700 mt-1">KES {myBills.filter(b=>b.status==="PAID").reduce((s,b)=>s+b.amount,0).toLocaleString()}</p></div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4"><p className="text-xs text-red-600 font-medium">Outstanding</p><p className="text-2xl font-bold text-red-700 mt-1">KES {unpaidBills.reduce((s,b)=>s+b.amount,0).toLocaleString()}</p></div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"><p className="text-xs text-blue-600 font-medium">Total Invoiced</p><p className="text-2xl font-bold text-blue-700 mt-1">KES {myBills.reduce((s,b)=>s+b.amount,0).toLocaleString()}</p></div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Invoice","Description","Amount","Status","Date","Payment","Action"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {myBills.map(b=>(
                  <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.id}</td>
                    <td className="px-4 py-3 text-gray-700">{b.description}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">KES {b.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge label={b.status} color={BILL_COLORS[b.status]||"bg-gray-100 text-gray-600"} /></td>
                    <td className="px-4 py-3 text-gray-400">{b.date}</td>
                    <td className="px-4 py-3 text-gray-500">{b.method||"—"}</td>
                    <td className="px-4 py-3">
                      {b.status !== "PAID" && (
                        <button onClick={() => setShowPayModal(b)} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 font-medium">Pay Now</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">My Health Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Upcoming Appointments" value="2" icon="📅" color="bg-green-600" />
            <StatCard label="Medical Records" value="3" icon="📋" color="bg-blue-600" />
            <StatCard label="Active Prescriptions" value="2" icon="💊" color="bg-purple-600" />
            <StatCard label="Pending Bills" value="1" icon="💳" color="bg-orange-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Appointments","appointments","📅","bg-blue-50 border-blue-100 text-blue-700"],["Medical Records","records","📋","bg-purple-50 border-purple-100 text-purple-700"],["Prescriptions","prescriptions","💊","bg-green-50 border-green-100 text-green-700"],["Bills","bills","💳","bg-orange-50 border-orange-100 text-orange-700"]].map(([label,id,icon,cls])=>(
              <button key={id as string} onClick={() => setTab(id as string)} className={`rounded-xl p-4 border text-left hover:shadow-md transition-shadow ${cls}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-semibold text-sm">{label as string}</p>
                <p className="text-xs opacity-70 mt-0.5">Open →</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">Next Appointment</h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="font-semibold text-gray-900">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-500">Cardiology · General Checkup</p>
                <p className="text-sm font-medium text-green-700 mt-2">📅 April 5, 2026 · 10:00 AM</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">Active Prescriptions</h3>
              {PRESCRIPTIONS.filter(p=>p.status==="Active").map(p=>(
                <div key={p.id} className="py-2 border-b last:border-0">
                  <p className="text-sm font-medium text-gray-900">{p.drug}</p>
                  <p className="text-xs text-gray-500">{p.dose} · {p.doctor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Appointments ── */}
      {tab === "appointments" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
          <div className="space-y-3">
            {APPOINTMENTS.map(a => (
              <div key={a.id} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={a.status} color={APPT_COLORS[a.status]} />
                      <span className="text-xs text-gray-400 font-mono">{a.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{a.doctor}</p>
                    <p className="text-sm text-gray-500">{a.specialty} · {a.reason}</p>
                    <p className="text-sm font-medium text-blue-700 mt-1">📅 {a.date} · {a.time}</p>
                  </div>
                  {a.status === "CONFIRMED" && (
                    <button className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium shrink-0">Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Medical Records ── */}
      {tab === "records" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Medical Records</h2>
          <div className="space-y-3">
            {RECORDS.map(r => (
              <div key={r.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedRecord(expandedRecord === r.id ? null : r.id)}>
                  <div>
                    <p className="font-semibold text-gray-900">{r.diagnosis}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.doctor} · {r.date}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{expandedRecord === r.id ? "▲" : "▼"}</span>
                </div>
                {expandedRecord === r.id && (
                  <div className="border-t bg-gray-50 p-4 space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Treatment: </span><span className="text-gray-600">{r.treatment}</span></div>
                    <div><span className="font-medium text-gray-700">Notes: </span><span className="text-gray-600">{r.notes}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Prescriptions ── */}
      {tab === "prescriptions" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">My Prescriptions</h2>
          <div className="space-y-3">
            {PRESCRIPTIONS.map(p => (
              <div key={p.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${p.status==="Active"?"border-green-500":"border-gray-300"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={p.status} color={p.status==="Active"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"} />
                      <span className="text-xs text-gray-400 font-mono">{p.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{p.drug}</p>
                    <p className="text-sm text-gray-600">{p.dose}</p>
                    <p className="text-xs text-gray-400 mt-1">Qty: {p.qty} · Issued: {p.issued} · {p.doctor}</p>
                  </div>
                  {p.status === "Active" && (
                    <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium shrink-0">Request Refill</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bills ── */}
      {tab === "bills" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Bills & Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4"><p className="text-xs text-green-600 font-medium">Total Paid</p><p className="text-2xl font-bold text-green-700 mt-1">KES 7,300</p></div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4"><p className="text-xs text-red-600 font-medium">Outstanding</p><p className="text-2xl font-bold text-red-700 mt-1">KES 6,200</p></div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4"><p className="text-xs text-blue-600 font-medium">Total Invoiced</p><p className="text-2xl font-bold text-blue-700 mt-1">KES 13,500</p></div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Invoice","Description","Amount","Status","Date","Payment"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {BILLS.map(b=>(
                  <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.id}</td>
                    <td className="px-4 py-3 text-gray-700">{b.description}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{b.amount}</td>
                    <td className="px-4 py-3"><Badge label={b.status} color={BILL_COLORS[b.status]} /></td>
                    <td className="px-4 py-3 text-gray-400">{b.date}</td>
                    <td className="px-4 py-3 text-gray-500">{b.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
