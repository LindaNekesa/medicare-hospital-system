import React from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

// Simple summary card component
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`flex items-center p-6 rounded-lg shadow hover:shadow-lg transition bg-white`}>
      <div className={`p-4 rounded-full ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  // Placeholder data, replace with backend API data later
  const patientsCount = 120;
  const appointmentsCount = 45;
  const pendingTasks = 8;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Patients"
          value={patientsCount}
          color="bg-blue-500"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A12 12 0 0112 15c2.485 0 4.77.714 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>}
        />
        <SummaryCard
          title="Appointments"
          value={appointmentsCount}
          color="bg-green-500"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>}
        />
        <SummaryCard
          title="Pending Tasks"
          value={pendingTasks}
          color="bg-yellow-500"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 01.707.293l.414.414a1 1 0 00.707.293H17a2 2 0 012 2v11a2 2 0 01-2 2z" />
                </svg>}
        />
      </div>

      {/* Optional: Add quick links or charts below */}
      <div className="mt-10 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Add Patient</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Schedule Appointment</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">View Pending Tasks</button>
        </div>
      </div>
    </div>
  );
}