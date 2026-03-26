"use client"

import { useSettings } from "@/hooks/useSettings"
import { useState, useEffect } from "react"

export default function SystemSettingsPanel(){

const { settingsQuery, updateSettings } = useSettings()

const [form,setForm] = useState<any>({})

useEffect(()=>{

if(settingsQuery.data){

setForm(settingsQuery.data)

}

},[settingsQuery.data])

if(settingsQuery.isLoading) return <p>Loading settings...</p>

return(

<div className="bg-white p-6 rounded shadow space-y-4">

<h2 className="text-xl font-bold">Hospital System Settings</h2>

<input
className="border p-2 w-full"
placeholder="Hospital Name"
value={form.hospitalName || ""}
onChange={(e)=>setForm({...form,hospitalName:e.target.value})}
/>

<input
className="border p-2 w-full"
placeholder="Hospital Email"
value={form.hospitalEmail || ""}
onChange={(e)=>setForm({...form,hospitalEmail:e.target.value})}
/>

<input
className="border p-2 w-full"
placeholder="Hospital Phone"
value={form.hospitalPhone || ""}
onChange={(e)=>setForm({...form,hospitalPhone:e.target.value})}
/>

<input
className="border p-2 w-full"
placeholder="Hospital Address"
value={form.hospitalAddress || ""}
onChange={(e)=>setForm({...form,hospitalAddress:e.target.value})}
/>

<div className="flex gap-4">

<input
className="border p-2"
type="time"
value={form.workingHoursStart || ""}
onChange={(e)=>setForm({...form,workingHoursStart:e.target.value})}
/>

<input
className="border p-2"
type="time"
value={form.workingHoursEnd || ""}
onChange={(e)=>setForm({...form,workingHoursEnd:e.target.value})}
/>

</div>

<input
className="border p-2 w-full"
type="number"
placeholder="Appointment Length (minutes)"
value={form.appointmentLength || ""}
onChange={(e)=>setForm({...form,appointmentLength:Number(e.target.value)})}
/>

<label className="flex gap-2 items-center">

<input
type="checkbox"
checked={form.enableNotifications || false}
onChange={(e)=>setForm({...form,enableNotifications:e.target.checked})}
/>

Enable Notifications

</label>

<button
onClick={()=>updateSettings.mutate(form)}
className="bg-blue-600 text-white px-4 py-2 rounded">

Save Settings

</button>

</div>

)

}