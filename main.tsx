import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";

/* ---------- Navbar Component ---------- */
function Navbar({ setPage }: { setPage: (p: string) => void }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Medicare Hospital System</h1>
      <ul className="flex space-x-4">
        <li className="hover:text-gray-200 cursor-pointer" onClick={() => setPage("dashboard")}>
          Dashboard
        </li>
        <li className="hover:text-gray-200 cursor-pointer" onClick={() => setPage("patients")}>
          Patients
        </li>
        <li className="hover:text-gray-200 cursor-pointer" onClick={() => setPage("appointments")}>
          Appointments
        </li>
      </ul>
    </nav>
  );
}

/* ---------- Dashboard Page ---------- */
function DashboardPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="text-xl font-bold">Patients</h3>
        <p className="text-2xl font-semibold mt-2">120</p>
      </div>
      <div className="card">
        <h3 className="text-xl font-bold">Appointments</h3>
        <p className="text-2xl font-semibold mt-2">45</p>
      </div>
      <div className="card">
        <h3 className="text-xl font-bold">Pending Tasks</h3>
        <p className="text-2xl font-semibold mt-2">8</p>
      </div>
    </div>
  );
}

/* ---------- Patients Page ---------- */
function PatientsPage() {
  const patients = [
    { id: 1, name: "John Doe", age: 34, condition: "Flu" },
    { id: 2, name: "Jane Smith", age: 29, condition: "Diabetes" },
    { id: 3, name: "Robert Johnson", age: 45, condition: "Hypertension" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patients</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Age</th>
            <th className="px-4 py-2 border">Condition</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="px-4 py-2 border">{p.id}</td>
              <td className="px-4 py-2 border">{p.name}</td>
              <td className="px-4 py-2 border">{p.age}</td>
              <td className="px-4 py-2 border">{p.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Appointments Page ---------- */
function AppointmentsPage() {
  const appointments = [
    { id: 1, patient: "John Doe", doctor: "Dr. Mark Lee", date: "2026-03-12", status: "Confirmed" },
    { id: 2, patient: "Jane Smith", doctor: "Dr. Emily Clark", date: "2026-03-13", status: "Pending" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Patient</th>
            <th className="px-4 py-2 border">Doctor</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="text-center">
              <td className="px-4 py-2 border">{a.id}</td>
              <td className="px-4 py-2 border">{a.patient}</td>
              <td className="px-4 py-2 border">{a.doctor}</td>
              <td className="px-4 py-2 border">{a.date}</td>
              <td className="px-4 py-2 border">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Main App ---------- */
function App() {
  const [page, setPage] = useState("dashboard");

  let PageComponent;
  if (page === "dashboard") PageComponent = <DashboardPage />;
  else if (page === "patients") PageComponent = <PatientsPage />;
  else if (page === "appointments") PageComponent = <AppointmentsPage />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar setPage={setPage} />
      {PageComponent}
    </div>
  );
}

/* ---------- Render React App ---------- */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);