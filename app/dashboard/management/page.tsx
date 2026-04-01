"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "departments", label: "Departments", icon: "🏢" },
  { id: "staff", label: "Staff Management", icon: "👥" },
  { id: "finance", label: "Finance & Budget", icon: "💰" },
  { id: "performance", label: "Performance", icon: "📈" },
  { id: "compliance", label: "Compliance", icon: "📜" },
  { id: "reports", label: "Reports", icon: "📋" },
];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[["Cardiology", "12 staff", "95% occupancy", "bg-red-50 border-red-100"], ["Pediatrics", "8 staff", "82% occupancy", "bg-blue-50 border-blue-100"], ["Surgery", "15 staff", "70% occupancy", "bg-green-50 border-green-100"]].map(([dept, staff, occ, cls]) => (
              <div key={dept} className={`rounded-xl p-4 border ${cls}`}>
                <p className="font-semibold text-gray-900">{dept}</p>
                <p className="text-sm text-gray-500 mt-1">{staff}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{occ}</p>
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
