"use client"

import { useState, useEffect } from "react"

type Log = { id: number; userId: number; action: string; entity: string; entityId?: number; timestamp: string }

export default function AuditLogsTable() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/logs")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500 py-4">Loading audit logs...</p>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">System Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>{["User ID", "Action", "Entity", "Entity ID", "Timestamp"].map(h => (
              <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No audit logs found</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{log.userId}</td>
                <td className="px-4 py-2 font-medium">{log.action}</td>
                <td className="px-4 py-2">{log.entity}</td>
                <td className="px-4 py-2">{log.entityId ?? "—"}</td>
                <td className="px-4 py-2 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
