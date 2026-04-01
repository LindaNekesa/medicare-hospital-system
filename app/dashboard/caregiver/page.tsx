"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "Overview", icon: "🤝" },
  { id: "patients", label: "My Patients", icon: "🏥" },
  { id: "appointments", label: "Appointments", icon: "📅" },
  { id: "medications", label: "Medications", icon: "💊" },
  { id: "updates", label: "Health Updates", icon: "📋" },
  { id: "messages", label: "Messages", icon: "💬" },
];

export default function CaregiverDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Caregiver Portal" role="Caregiver" accentColor="bg-orange-600" icon="🤝" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Care Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Patients in Care" value="2" icon="🏥" color="bg-orange-500" />
            <StatCard label="Upcoming Visits" value="3" icon="📅" color="bg-blue-600" />
            <StatCard label="Medications Due" value="4" icon="💊" color="bg-purple-600" />
            <StatCard label="Unread Updates" value="2" icon="📋" color="bg-green-600" />
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Patients Under Care</h3>
            {[["John Doe", "Hypertension", "Next visit: Apr 5", "Stable"], ["Mary Wanjiku", "Diabetes", "Next visit: Apr 8", "Monitoring"]].map(([name, cond, visit, status]) => (
              <div key={name} className="flex items-center gap-4 py-3 border-b last:border-0">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">{name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{cond} · {visit}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab !== "overview" && (
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center text-gray-400">
          <div className="text-4xl mb-3">{NAV.find(n => n.id === tab)?.icon}</div>
          <p className="font-medium text-gray-600">{NAV.find(n => n.id === tab)?.label}</p>
        </div>
      )}
    </DashboardShell>
  );
}
