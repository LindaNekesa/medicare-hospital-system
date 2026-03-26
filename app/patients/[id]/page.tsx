import PatientDetails from "@/components/patients/PatientDetails"

export default function PatientPage() {

  const patient = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    phone: "0712345678",
    email: "john@example.com",
    address: "Nairobi",
    dateOfBirth: "1990-01-01"
  }

  return (
    <div className="p-8">
      <PatientDetails patient={patient} />
    </div>
  )
}