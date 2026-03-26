"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function StaffManagementTable() {

  const queryClient = useQueryClient()
  const [form, setForm] = useState({ name:"", email:"", role:"DOCTOR" })

  const { data:staff=[] } = useQuery({
    queryKey:["staff"],
    queryFn:async()=>{
      const res = await fetch("/api/admin/users")
      return res.json()
    }
  })

  const createUser = useMutation({
    mutationFn: async()=> {
      await fetch("/api/admin/users",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify(form)
      })
    },
    onSuccess:()=>queryClient.invalidateQueries(["staff"])
  })

  const deleteUser = useMutation({
    mutationFn: async(id:number)=>{
      await fetch(`/api/admin/users/${id}`,{method:"DELETE"})
    },
    onSuccess:()=>queryClient.invalidateQueries(["staff"])
  })

  return(
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Staff Management</h2>

      <div className="flex gap-2">
        <input placeholder="Name"
        onChange={(e)=>setForm({...form,name:e.target.value})}
        className="border p-2"/>

        <input placeholder="Email"
        onChange={(e)=>setForm({...form,email:e.target.value})}
        className="border p-2"/>

        <select
        onChange={(e)=>setForm({...form,role:e.target.value})}
        className="border p-2">
          <option>DOCTOR</option>
          <option>NURSE</option>
          <option>ADMIN</option>
          <option>RECEPTIONIST</option>
        </select>

        <button
        onClick={()=>createUser.mutate()}
        className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Staff
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((user:any)=>(
            <tr key={user.id} className="border-b">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                onClick={()=>deleteUser.mutate(user.id)}
                className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}