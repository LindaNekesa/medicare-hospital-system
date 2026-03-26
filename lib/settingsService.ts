export async function fetchSettings(){

  const res = await fetch("/api/settings")

  if(!res.ok) throw new Error("Failed to fetch settings")

  return res.json()

}

export async function updateSettings(data:any){

  const res = await fetch("/api/settings",{

    method:"PATCH",

    headers:{ "Content-Type":"application/json" },

    body:JSON.stringify(data)

  })

  if(!res.ok) throw new Error("Failed to update settings")

  return res.json()

}