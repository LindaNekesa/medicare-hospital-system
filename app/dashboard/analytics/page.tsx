"use client"

export default function AnalyticsPage() {

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Hospital Analytics
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 shadow rounded">
          <h3>Total Patients</h3>
          <p className="text-2xl font-bold">1200</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3>Appointments Today</h3>
          <p className="text-2xl font-bold">56</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3>Lab Tests</h3>
          <p className="text-2xl font-bold">30</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3>Doctors</h3>
          <p className="text-2xl font-bold">12</p>
        </div>

      </div>

    </div>
  )
}