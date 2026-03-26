"use client"

import { useEffect, useState } from "react"

export default function NotificationsPanel(){

const [notifications,setNotifications] = useState<any[]>([])

useEffect(()=>{

const ws = new WebSocket("ws://localhost:3001")

ws.onmessage = (event)=>{
const data = JSON.parse(event.data)
setNotifications((prev)=>[data,...prev])
}

return ()=>ws.close()

},[])

return(

<div>

<h2 className="text-xl font-bold mb-4">Live Notifications</h2>

<div className="space-y-2">

{notifications.map((n,i)=>(
<div key={i} className="p-3 border rounded bg-gray-50">
{n.message}
</div>
))}

</div>

</div>

)
}