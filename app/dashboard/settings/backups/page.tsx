export default function BackupPage() {

  return (
    <div>

      <h1 className="text-xl font-bold mb-4">
        Backup & Restore
      </h1>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Create Backup
      </button>

      <button className="bg-red-600 text-white px-4 py-2 rounded ml-3">
        Restore Backup
      </button>

    </div>
  )
}