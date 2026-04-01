"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "compliance", label: "Compliance", icon: "📜" },
  { id: "inspections", label: "Inspections", icon: "🔍" },
  { id: "licenses", label: "Licenses", icon: "🏅" },
  { id: "statistics", label: "Health Statistics", icon: "📈" },
  { id: "incidents", label: "Incident Reports", icon: "⚠️" },
  { id: "policies", label: "Policies", icon: "📋" },
];

export default function GovernmentDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Regulatory Portal" role="Government & Regulatory Body" accentColor="bg-teal-700" icon="🏛️" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Regulatory Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Licensed Facilities" value="142" icon="🏅" color="bg-teal-600" />
            <StatCard label="Pending Inspections" value="8" icon="🔍" color="bg-orange-500" />
            <StatCard label="Compliance Rate" value="96%" icon="📜" color="bg-green-600" />
            <StatCard label="Open Incidents" value="3" icon="⚠️" color="bg-red-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">Compliance Status</h3>
              {[["Medicare Hospital", "Valid", "Expires Dec 2026", "bg-green-100 text-green-700"], ["City Clinic", "Valid", "Expires Mar 2027", "bg-green-100 text-green-700"], ["Rural Health Center", "Renewal Due", "Expires Apr 2026", "bg-yellow-100 text-yellow-700"]].map(([name, status, exp, cls]) => (
                <div key={name} className="py-2.5 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{exp}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">National Health Stats</h3>
              {[["Outpatient Visits", "48,204"], ["Inpatient Admissions", "12,890"], ["Surgeries Performed", "3,421"], ["Maternal Deliveries", "1,204"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b last:border-0 text-sm">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
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
