"use client"

import { useEffect, useState } from "react"

type Task = { id: number; title: string; status: string }

export default function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id} className="text-center border">
            <td className="p-2 border">{task.title}</td>
            <td className="p-2 border">{task.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}