// app/page.tsx
import React from "react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Welcome to Medicare Hospital System</h2>
      <p className="mb-6 text-gray-700">
        Manage patients, appointments, and hospital data efficiently with this system.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Patients</h3>
          <p>View and manage all patient records.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Appointments</h3>
          <p>Schedule, edit, or cancel appointments.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Reports</h3>
          <p>Generate hospital reports and statistics.</p>
        </div>
      </div>
    </div>
  );
}