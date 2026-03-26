"use client"

import { useQuery } from "@tanstack/react-query"

export default function PatientAppointments(){

const {data:appointments=[]} = useQuery({
queryKey:["appointments"],
queryFn:async()=>{
const res = await fetch("/api/appointments")
return res.json()
}
})

return(

<div>

<h2 className="text-xl font-bold mb-3">Recent Appointments</h2>

<table className="w-full border">

<thead className="bg-gray-100">

<tr>
<th>Patient</th>
<th>Doctor</th>
<th>Date</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{appointments.map((a:any)=>(

<tr key={a.id} className="border-b">

<td>{a.patient.firstName} {a.patient.lastName}</td>

<td>{a.doctor.name}</td>

<td>{new Date(a.date).toLocaleDateString()}</td>

<td>

<span className={`px-2 py-1 rounded text-white ${
a.status === "CONFIRMED" ? "bg-green-500" :
a.status === "PENDING" ? "bg-yellow-500" :
"bg-red-500"
}`}>

{a.status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}