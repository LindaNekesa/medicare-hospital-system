export default function RolesPage() {

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Roles & Permissions
      </h1>

      <table className="w-full bg-white rounded shadow">

        <thead>
          <tr>
            <th>Permission</th>
            <th>Admin</th>
            <th>Doctor</th>
            <th>Nurse</th>
          </tr>
        </thead>

      </table>

    </div>
  )
}