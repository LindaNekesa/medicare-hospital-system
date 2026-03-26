"use client"

type Props = {
  patientId: number
  onDelete: (id: number) => void
}

export default function PatientDeleteDialog({
  patientId,
  onDelete
}: Props) {

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this patient?")) {
      onDelete(patientId)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Delete
    </button>
  )
}