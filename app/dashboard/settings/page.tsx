"use client"

import { useState } from "react"

export default function SettingsPage() {

  const [settings, setSettings] = useState({
    hospitalName: "Medicare Hospital",
    hospitalEmail: "info@medicare.com",
    hospitalPhone: "+254712345678",
    hospitalAddress: "Kakamega, Kenya",
    appointmentDuration: 30,
    maxAppointmentsPerDay: 50,
    onlineBooking: true,
    labModule: true,
    defaultLabTechnician: "Technician 1",
    emailAlerts: true,
    smsAlerts: false,
    passwordLength: 8,
    sessionTimeout: 30
  })

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        System Settings
      </h1>

      {/* GENERAL SETTINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">General</h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            className="border p-2"
            placeholder="Hospital Name"
            defaultValue={settings.hospitalName}
          />

          <input
            className="border p-2"
            placeholder="Hospital Email"
            defaultValue={settings.hospitalEmail}
          />

          <input
            className="border p-2"
            placeholder="Hospital Phone"
            defaultValue={settings.hospitalPhone}
          />

          <input
            className="border p-2"
            placeholder="Hospital Address"
            defaultValue={settings.hospitalAddress}
          />

        </div>
      </div>

      {/* APPOINTMENT SETTINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Appointments</h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            className="border p-2"
            placeholder="Default Appointment Duration"
            defaultValue={settings.appointmentDuration}
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Max Appointments Per Day"
            defaultValue={settings.maxAppointmentsPerDay}
          />

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={settings.onlineBooking} />
            Enable Online Booking
          </label>

        </div>
      </div>

      {/* LAB SETTINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Lab</h2>

        <div className="grid grid-cols-2 gap-4">

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={settings.labModule} />
            Enable Lab Module
          </label>

          <input
            className="border p-2"
            placeholder="Default Lab Technician"
            defaultValue={settings.defaultLabTechnician}
          />

        </div>
      </div>

      {/* NOTIFICATION SETTINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>

        <div className="flex flex-col gap-3">

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={settings.emailAlerts} />
            Enable Email Alerts
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={settings.smsAlerts} />
            Enable SMS Alerts
          </label>

        </div>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Security</h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            className="border p-2"
            placeholder="Password Length"
            defaultValue={settings.passwordLength}
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Session Timeout (minutes)"
            defaultValue={settings.sessionTimeout}
          />

        </div>
      </div>

      {/* SAVE BUTTON */}
      <div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Settings
        </button>
      </div>

    </div>
  )
}