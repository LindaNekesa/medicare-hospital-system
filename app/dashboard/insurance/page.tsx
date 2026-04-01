"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "claims", label: "Claims", icon: "📄" },
  { id: "members", label: "Members", icon: "👥" },
  { id: "preauth", label: "Pre-Authorization", icon: "✅" },
  { id: "billing", label: "Billing", icon: "💰" },
  { id: "reports", label: "Reports", icon: "📈" },
];

export default function InsuranceDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Insurance Portal" role="Insurance Company" accentColor="bg-pink-700" icon="🛡️" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Insurance Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Active Members" value="3,420" icon="👥" color="bg-pink-600" />
            <StatCard label="Pending Claims" value="47" icon="📄" color="bg-orange-500" />
            <StatCard label="Approved This Month" value="128" icon="✅" color="bg-green-600" />
            <StatCard label="Total Paid Out" value="KES 1.2M" icon="💰" color="bg-blue-600" />
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Claims</h3>
            {[["CLM-001", "John Doe", "KES 12,000", "PENDING"], ["CLM-002", "Jane Smith", "KES 8,500", "APPROVED"], ["CLM-003", "Ali Hassan", "KES 45,000", "UNDER REVIEW"]].map(([id, name, amt, status]) => (
              <div key={id} className="flex items-center gap-4 py-2.5 border-b last:border-0 text-sm">
                <span className="text-gray-400 font-mono w-20 shrink-0">{id}</span>
                <span className="flex-1 text-gray-800">{name}</span>
                <span className="font-medium text-gray-900">{amt}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === "APPROVED" ? "bg-green-100 text-green-700" : status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{status}</span>
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
