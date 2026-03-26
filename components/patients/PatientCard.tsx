type PatientCardProps = {
  name: string
  gender: string
  phone: string
  email: string
}

export default function PatientCard({
  name,
  gender,
  phone,
  email
}: PatientCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold">{name}</h3>

      <p className="text-gray-600 dark:text-gray-300">
        Gender: {gender}
      </p>

      <p className="text-gray-600 dark:text-gray-300">
        Phone: {phone}
      </p>

      <p className="text-gray-600 dark:text-gray-300">
        Email: {email}
      </p>
    </div>
  )
}