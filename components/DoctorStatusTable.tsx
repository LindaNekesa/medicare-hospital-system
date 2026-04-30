"use client";

import { useQuery } from "@tanstack/react-query";

type Doctor = {
  id: number;
  name: string;
  email: string;
  doctorAppointments: {
    id: number;
    appointmentDate: string;
    patient: { firstName: string; lastName: string };
  }[];
  tasks: { id: number; title: string; dueDate: string }[];
};

export default function DoctorStatusTable() {
  // ✅ FIXED (React Query v5 syntax)
  const { data: doctors = [], isLoading } = useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    },
    refetchInterval: 5000, // refresh every 5 seconds
  });

  if (isLoading) return <p>Loading doctors...</p>;

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Doctor</th>
          <th className="p-2 border">Pending Appointments</th>
          <th className="p-2 border">Pending Tasks</th>
          <th className="p-2 border">Availability</th>
        </tr>
      </thead>
      <tbody>
        {doctors.map((doc) => (
          <tr key={doc.id} className="border-b">
            <td className="p-2">{doc.name}</td>

            <td className="p-2">
              {doc.doctorAppointments.length === 0 ? (
                <span className="text-green-600 font-semibold">None</span>
              ) : (
                doc.doctorAppointments.map((appt) => (
                  <div key={appt.id}>
                    {appt.patient.firstName} {appt.patient.lastName} —{" "}
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </div>
                ))
              )}
            </td>

            <td className="p-2">
              {doc.tasks.length === 0 ? (
                <span className="text-green-600 font-semibold">None</span>
              ) : (
                doc.tasks.map((task) => (
                  <div key={task.id}>
                    {task.title} — due{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                ))
              )}
            </td>

            <td className="p-2">
              {doc.doctorAppointments.length === 0 ? (
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                  Available
                </span>
              ) : (
                <span className="bg-red-200 text-red-800 px-2 py-1 rounded">
                  Busy
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}