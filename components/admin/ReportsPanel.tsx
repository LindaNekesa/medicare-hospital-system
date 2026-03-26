"use client"

import { useQuery } from "@tanstack/react-query"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"

export default function ReportsPanel(){

const {data=[]} = useQuery({
queryKey:["reports"],
queryFn:async()=>{
const res = await fetch("/api/admin/reports")
return res.json()
}
})

return(

<div>

<h2 className="text-xl font-bold mb-4">Hospital Reports</h2>

<div className="h-80">

<ResponsiveContainer>

<BarChart data={data}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="patients"/>
<Bar dataKey="appointments"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)
}