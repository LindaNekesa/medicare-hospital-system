"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "users", label: "User Management", icon: "👥" },
  { id: "staff", label: "Medical Staff", icon: "🩺" },
  { id: "patients", label: "Patients", icon: "🏥" },
  { id: "appointments", label: "Appointments", icon: "📅" },
  { id: "billing", label: "Billing", icon: "💰" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "settings", label: "System Settings", icon: "⚙️" },
  { id: "audit", label: "Audit Logs", icon: "🔍" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Admin Panel" role="System Administrator" accentColor="bg-slate-800" icon="🔒" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value="248" icon="👥" color="bg-slate-700" />
            <StatCard label="Active Staff" value="42" icon="🩺" color="bg-blue-600" />
            <StatCard label="Patients" value="1,204" icon="🏥" color="bg-green-600" />
            <StatCard label="Today's Appointments" value="38" icon="📅" color="bg-purple-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
              {["New patient registered — John Doe", "Appointment confirmed — Dr. Smith", "Bill paid — KES 4,500", "Staff account created — Nurse Mary"].map((a, i) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  {a}
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">System Health</h3>
              {[["Database", "Online", "bg-green-500"], ["API Server", "Online", "bg-green-500"], ["Auth Service", "Online", "bg-green-500"], ["Backup", "Last: 2h ago", "bg-yellow-500"]].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                  <span className="text-gray-600">{k}</span>
                  <span className={`flex items-center gap-1.5 font-medium text-gray-800`}>
                    <span className={`w-2 h-2 rounded-full ${c}`} />{v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "users" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-500 text-sm">Manage all system users, roles, and permissions.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[["ADMIN", "2", "bg-slate-100 text-slate-700"], ["HOSPITAL_MANAGEMENT", "5", "bg-blue-100 text-blue-700"], ["MEDICAL_STAFF", "42", "bg-green-100 text-green-700"], ["PATIENT", "1,204", "bg-purple-100 text-purple-700"], ["CAREGIVER", "89", "bg-orange-100 text-orange-700"], ["INSURANCE", "12", "bg-pink-100 text-pink-700"]].map(([role, count, cls]) => (
              <div key={role} className={`rounded-lg p-3 ${cls}`}>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs font-medium">{role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab !== "overview" && tab !== "users" && (
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center text-gray-400">
          <div className="text-4xl mb-3">{NAV.find(n => n.id === tab)?.icon}</div>
          <p className="font-medium text-gray-600">{NAV.find(n => n.id === tab)?.label}</p>
          <p className="text-sm mt-1">This section is ready for data integration.</p>
        </div>
      )}
    </DashboardShell>
  );
}
