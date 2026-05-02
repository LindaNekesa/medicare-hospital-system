export default function PatientDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Patient Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          Upcoming Appointments
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          Medical Records
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          Prescriptions
        </div>
      </div>
    </div>
  )
}
