import PatientRegistrationForm from "@/components/patients/PatientRegistrationForm"
import PatientTable from "@/components/patients/PatientsTable"
import PatientSearch from "@/components/patients/PatientSearch"

export default function PatientsPage() {
  const patients = [
    { id: 1, name: "John Doe", gender: "Male", phone: "0712345678" },
    { id: 2, name: "Jane Smith", gender: "Female", phone: "0723456789" }
  ]

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">
        Patients
      </h1>

      <PatientSearch onSearch={(value) => console.log(value)} />

      <PatientTable patients={patients} />

    </div>
  )
}