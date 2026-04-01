"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "patients", label: "My Patients", icon: "🏥" },
  { id: "appointments", label: "Schedule", icon: "📅" },
  { id: "records", label: "Medical Records", icon: "📋" },
  { id: "lab", label: "Lab Results", icon: "🔬" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "profile", label: "My Profile", icon: "👤" },
];

export default function MedicalStaffDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Staff Portal" role="Medical Staff" accentColor="bg-blue-700" icon="🩺" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Today&apos;s Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Today's Patients" value="12" icon="🏥" color="bg-blue-600" />
            <StatCard label="Appointments" value="8" icon="📅" color="bg-green-600" />
            <StatCard label="Pending Lab Results" value="3" icon="🔬" color="bg-yellow-500" />
            <StatCard label="Open Tasks" value="5" icon="✅" color="bg-purple-600" />
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Today&apos;s Schedule</h3>
            {[
              ["09:00", "John Doe", "General Checkup", "CONFIRMED"],
              ["10:30", "Jane Smith", "Follow-up", "PENDING"],
              ["11:00", "Ali Hassan", "Consultation", "CONFIRMED"],
              ["14:00", "Mary Wanjiku", "Lab Review", "PENDING"],
            ].map(([time, name, reason, status]) => (
              <div key={time} className="flex items-center gap-4 py-2.5 border-b last:border-0">
                <span className="text-sm font-mono text-gray-500 w-14 shrink-0">{time}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{reason}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{status}</span>
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
