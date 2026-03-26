"use client"

import { useQuery } from "@tanstack/react-query"

export default function AuditLogsTable(){

  const {data:logs=[]} = useQuery({
    queryKey:["logs"],
    queryFn:async()=>{
      const res = await fetch("/api/admin/logs")
      return res.json()
    }
  })

  return(
    <div>

      <h2 className="text-xl font-bold mb-4">System Audit Logs</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Table</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log:any)=>(
            <tr key={log.id} className="border-b">
              <td>{log.user.name}</td>
              <td>{log.action}</td>
              <td>{log.tableName}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}