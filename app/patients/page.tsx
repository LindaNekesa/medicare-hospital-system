// app/patients/page.tsx
import React from "react";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  condition: string;
}

const patients: Patient[] = [
  { id: 1, name: "John Doe", age: 34, gender: "Male", condition: "Flu" },
  { id: 2, name: "Jane Smith", age: 29, gender: "Female", condition: "Diabetes" },
  { id: 3, name: "Robert Johnson", age: 45, gender: "Male", condition: "Hypertension" },
];

export default function PatientsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Patients</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-4">{patient.id}</td>
                <td className="px-6 py-4">{patient.name}</td>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">{patient.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}