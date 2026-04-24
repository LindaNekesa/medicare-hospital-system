import PatientRegistrationForm from "@/components/patients/PatientRegistrationForm"
import PatientTable from "@/components/patients/PatientsTable"
import PatientSearch from "@/components/patients/PatientSearch"

export default function PatientsPage() {
  const patients = [
    { id: 1, firstName: "John",  lastName: "Doe",   gender: "MALE"   as const, phone: "0712345678" },
    { id: 2, firstName: "Jane",  lastName: "Smith",  gender: "FEMALE" as const, phone: "0723456789" },
  ]

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Patients</h1>
      <PatientSearch onSearch={(value) => console.log(value)} />
      <PatientTable patients={patients} />
    </div>
  )
}