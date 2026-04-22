"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import UserProfile from "@/components/profile/UserProfile";

const NAV = [
  { id: "overview",      label: "Overview",           icon: "📊" },
  { id: "prescriptions", label: "Prescriptions",      icon: "📋" },
  { id: "dispensing",    label: "Dispensing",         icon: "💊" },
  { id: "inventory",     label: "Drug Inventory",     icon: "📦" },
  { id: "interactions",  label: "Drug Interactions",  icon: "⚠️" },
  { id: "counseling",    label: "Patient Counseling", icon: "💬" },
  { id: "profile",       label: "My Profile",         icon: "👤" },
];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

const PRESCRIPTIONS = [
  { id:"RX-001", patient:"John Doe",     drug:"Amlodipine 5mg",  qty:"30 tabs", doctor:"Dr. Sarah Johnson", date:"Apr 8, 2026", status:"PENDING",   interaction:false },
  { id:"RX-002", patient:"Jane Smith",   drug:"Metformin 500mg", qty:"60 tabs", doctor:"Dr. Peter Kamau",   date:"Apr 8, 2026", status:"PENDING",   interaction:false },
  { id:"RX-003", patient:"Ali Hassan",   drug:"Warfarin 5mg",    qty:"30 tabs", doctor:"Dr. Sarah Johnson", date:"Apr 8, 2026", status:"FLAGGED",   interaction:true },
  { id:"RX-004", patient:"Samuel Kibet", drug:"Furosemide 40mg", qty:"30 tabs", doctor:"Dr. Peter Kamau",   date:"Apr 7, 2026", status:"DISPENSED", interaction:false },
];

const INVENTORY = [
  { drug:"Amlodipine 5mg",  stock:450, reorder:100, unit:"Tablets", expiry:"Dec 2027", status:"OK" },
  { drug:"Metformin 500mg", stock:280, reorder:200, unit:"Tablets", expiry:"Jun 2027", status:"OK" },
  { drug:"Warfarin 5mg",    stock:85,  reorder:100, unit:"Tablets", expiry:"Mar 2027", status:"LOW" },
  { drug:"Furosemide 40mg", stock:320, reorder:150, unit:"Tablets", expiry:"Sep 2027", status:"OK" },
  { drug:"Amoxicillin 500mg",stock:12, reorder:200, unit:"Capsules",expiry:"Jan 2027", status:"CRITICAL" },
  { drug:"Paracetamol 500mg",stock:890,reorder:300, unit:"Tablets", expiry:"Aug 2027", status:"OK" },
];

export default function PharmacyDashboard() {
  const [tab, setTab] = useState("overview");
  const [prescriptions, setPrescriptions] = useState(PRESCRIPTIONS);
  const [toast, setToast] = useState("");

  const dispense = (id: string) => {
    setPrescriptions(p => p.map(x => x.id === id ? { ...x, status: "DISPENSED" } : x));
    setToast("Prescription dispensed successfully");
    setTimeout(() => setToast(""), 3000);
  };

  const STATUS_COLORS: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-700", DISPENSED: "bg-green-100 text-green-700", FLAGGED: "bg-red-100 text-red-700" };
  const STOCK_COLORS: Record<string, string> = { OK: "bg-green-100 text-green-700", LOW: "bg-yellow-100 text-yellow-700", CRITICAL: "bg-red-100 text-red-700" };

  return (
    <DashboardShell title="Pharmacy Portal" role="Pharmacist" accentColor="bg-purple-700" icon="💊" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {toast && <div className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}

      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Pharmacy Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Pending Rx", prescriptions.filter(p=>p.status==="PENDING").length, "bg-yellow-500", "📋"],
              ["Dispensed Today", prescriptions.filter(p=>p.status==="DISPENSED").length, "bg-green-600", "✅"],
              ["Flagged", prescriptions.filter(p=>p.status==="FLAGGED").length, "bg-red-600", "⚠️"],
              ["Low Stock", INVENTORY.filter(i=>i.status!=="OK").length, "bg-orange-500", "📦"]].map(([l,v,c,i]) => (
              <div key={l as string} className={`${c} text-white rounded-xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-2"><span className="text-2xl">{i}</span><span className="text-3xl font-bold">{v}</span></div>
                <p className="text-sm font-medium opacity-90">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Pharmacist Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[["💊 Dispensing","Verify and dispense prescribed medications"],
                ["🔍 Prescription Review","Check for errors, interactions, and appropriateness"],
                ["⚠️ Drug Interactions","Identify and flag dangerous drug combinations"],
                ["📦 Inventory Management","Maintain stock levels and expiry tracking"],
                ["💬 Patient Counseling","Educate patients on medication use and side effects"],
                ["🧪 Compounding","Prepare customised medications when needed"],
                ["📋 Documentation","Maintain accurate dispensing records"],
                ["🏥 Clinical Support","Advise clinical staff on drug therapy"]].map(([t,d]) => (
                <div key={t as string} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="shrink-0">{(t as string).split(" ")[0]}</span>
                  <div><p className="font-medium text-gray-800 text-xs">{(t as string).slice(3)}</p><p className="text-xs text-gray-500">{d as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "prescriptions" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Incoming Prescriptions</h2>
          <div className="space-y-3">
            {prescriptions.map(rx => (
              <div key={rx.id} className={`bg-white rounded-xl border-l-4 shadow-sm p-4 ${rx.status==="FLAGGED"?"border-red-500":rx.status==="DISPENSED"?"border-green-500":"border-yellow-400"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={rx.status} color={STATUS_COLORS[rx.status]} />
                      {rx.interaction && <Badge label="⚠ Drug Interaction" color="bg-red-100 text-red-700" />}
                      <span className="text-xs text-gray-400 font-mono">{rx.id}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{rx.patient}</p>
                    <p className="text-sm text-purple-700 font-medium">{rx.drug} · {rx.qty}</p>
                    <p className="text-xs text-gray-500 mt-1">Prescribed by: {rx.doctor} · {rx.date}</p>
                    {rx.interaction && <p className="text-xs text-red-600 mt-1 font-medium">⚠ Check for interaction with Warfarin before dispensing</p>}
                  </div>
                  {rx.status === "PENDING" && (
                    <button onClick={() => dispense(rx.id)} className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 font-medium shrink-0">Dispense</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "dispensing" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Dispensing Log</h2>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Rx ID","Patient","Drug","Qty","Doctor","Date","Status"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {prescriptions.map(rx=>(
                  <tr key={rx.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{rx.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{rx.patient}</td>
                    <td className="px-4 py-3 text-gray-600">{rx.drug}</td>
                    <td className="px-4 py-3 text-gray-600">{rx.qty}</td>
                    <td className="px-4 py-3 text-gray-500">{rx.doctor}</td>
                    <td className="px-4 py-3 text-gray-400">{rx.date}</td>
                    <td className="px-4 py-3"><Badge label={rx.status} color={STATUS_COLORS[rx.status]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Drug Inventory</h2>
          <div className="grid grid-cols-3 gap-3">
            {[["OK",INVENTORY.filter(i=>i.status==="OK").length,"bg-green-50 border-green-100 text-green-700"],
              ["Low Stock",INVENTORY.filter(i=>i.status==="LOW").length,"bg-yellow-50 border-yellow-100 text-yellow-700"],
              ["Critical",INVENTORY.filter(i=>i.status==="CRITICAL").length,"bg-red-50 border-red-100 text-red-700"]].map(([l,v,c])=>(
              <div key={l as string} className={`rounded-xl border p-3 text-center ${c}`}><p className="text-2xl font-bold">{v as number}</p><p className="text-xs font-medium mt-0.5">{l as string}</p></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50 border-b">{["Drug","Stock","Reorder Level","Unit","Expiry","Status"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {INVENTORY.map(item=>(
                  <tr key={item.drug} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.drug}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.stock}</td>
                    <td className="px-4 py-3 text-gray-500">{item.reorder}</td>
                    <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                    <td className="px-4 py-3 text-gray-400">{item.expiry}</td>
                    <td className="px-4 py-3"><Badge label={item.status} color={STOCK_COLORS[item.status]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "interactions" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Drug Interaction Checker</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-semibold text-red-800 mb-2">⚠ Active Interaction Alert</p>
            <p className="text-sm text-red-700"><strong>Patient: Ali Hassan</strong> — Warfarin 5mg prescribed</p>
            <p className="text-sm text-red-600 mt-1">Warfarin + Aspirin: Increased bleeding risk. Verify with prescribing doctor before dispensing.</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Common Interactions Reference</h3>
            {[["Warfarin + Aspirin","Increased bleeding risk — monitor INR closely"],
              ["Metformin + Alcohol","Risk of lactic acidosis — advise patient"],
              ["ACE Inhibitors + Potassium","Hyperkalaemia risk — monitor electrolytes"],
              ["Digoxin + Amiodarone","Increased digoxin toxicity — reduce dose"],
              ["Statins + Macrolides","Increased myopathy risk — consider alternatives"]].map(([pair,note])=>(
              <div key={pair as string} className="py-2.5 border-b last:border-0">
                <p className="text-sm font-medium text-gray-900">{pair as string}</p>
                <p className="text-xs text-gray-500 mt-0.5">{note as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "counseling" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Patient Counseling</h2>
          {[{patient:"John Doe",drug:"Amlodipine 5mg",points:["Take once daily in the morning","May cause ankle swelling — report if severe","Do not stop suddenly without doctor advice","Avoid grapefruit juice"]},
            {patient:"Jane Smith",drug:"Metformin 500mg",points:["Take with meals to reduce stomach upset","Stay well hydrated","Report any unusual muscle pain","Regular blood sugar monitoring required"]}].map(c=>(
            <div key={c.patient} className="bg-white rounded-xl border shadow-sm p-4">
              <p className="font-semibold text-gray-900">{c.patient}</p>
              <p className="text-sm text-purple-700 font-medium mb-2">{c.drug}</p>
              <ul className="space-y-1">
                {c.points.map(p=><li key={p} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-purple-500 shrink-0">•</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && <UserProfile />}
    </DashboardShell>
  );
}
