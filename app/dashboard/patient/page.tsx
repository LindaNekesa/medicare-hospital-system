"use client";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";

const NAV = [
  { id: "overview", label: "My Health", icon: "❤️" },
  { id: "appointments", label: "Appointments", icon: "📅" },
  { id: "records", label: "Medical Records", icon: "📋" },
  { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  { id: "bills", label: "Bills & Payments", icon: "💳" },
  { id: "profile", label: "My Profile", icon: "👤" },
];

export default function PatientDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell title="Patient Portal" role="Patient" accentColor="bg-green-600" icon="🏥" navItems={NAV} activeTab={tab} onTabChange={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">My Health Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Upcoming Appointments" value="2" icon="📅" color="bg-green-600" />
            <StatCard label="Medical Records" value="8" icon="📋" color="bg-blue-600" />
            <StatCard label="Active Prescriptions" value="3" icon="💊" color="bg-purple-600" />
            <StatCard label="Pending Bills" value="1" icon="💳" color="bg-orange-500" />
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
              <h3 className="font-semibold text-gray-800 mb-3">Recent Prescriptions</h3>
              {[["Amlodipine 5mg", "Once daily", "Dr. Johnson"], ["Metformin 500mg", "Twice daily", "Dr. Kamau"]].map(([drug, freq, doc]) => (
                <div key={drug} className="py-2 border-b last:border-0">
                  <p className="text-sm font-medium text-gray-900">{drug}</p>
                  <p className="text-xs text-gray-500">{freq} · {doc}</p>
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
          <p className="text-sm mt-1">Your {NAV.find(n => n.id === tab)?.label.toLowerCase()} will appear here.</p>
        </div>
      )}
    </DashboardShell>
  );
}
