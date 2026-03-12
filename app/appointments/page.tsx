// app/appointments/page.tsx
import React from "react";

interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

const appointments: Appointment[] = [
  { id: 1, patientName: "John Doe", doctor: "Dr. Emily Clark", date: "2026-03-12", time: "10:00 AM", status: "Confirmed" },
  { id: 2, patientName: "Jane Smith", doctor: "Dr. Mark Lee", date: "2026-03-13", time: "2:00 PM", status: "Pending" },
  { id: 3, patientName: "Robert Johnson", doctor: "Dr. Emily Clark", date: "2026-03-14", time: "11:30 AM", status: "Cancelled" },
];

export default function AppointmentsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Appointments</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-4">{appointment.id}</td>
                <td className="px-6 py-4">{appointment.patientName}</td>
                <td className="px-6 py-4">{appointment.doctor}</td>
                <td className="px-6 py-4">{appointment.date}</td>
                <td className="px-6 py-4">{appointment.time}</td>
                <td className={`px-6 py-4 font-semibold ${
                  appointment.status === "Confirmed"
                    ? "text-green-600"
                    : appointment.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}