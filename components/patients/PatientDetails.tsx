type Patient = {
  id: number
  firstName: string
  lastName: string
  gender: string
  phone: string
  email: string
  address: string
  dateOfBirth: string
}

type Props = {
  patient: Patient
}

export default function PatientDetails({ patient }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold">
        {patient.firstName} {patient.lastName}
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <p>
          <span className="font-semibold">Gender:</span> {patient.gender}
        </p>

        <p>
          <span className="font-semibold">Date of Birth:</span>{" "}
          {patient.dateOfBirth}
        </p>

        <p>
          <span className="font-semibold">Phone:</span> {patient.phone}
        </p>

        <p>
          <span className="font-semibold">Email:</span> {patient.email}
        </p>

        <p className="col-span-2">
          <span className="font-semibold">Address:</span> {patient.address}
        </p>

      </div>
    </div>
  )
}