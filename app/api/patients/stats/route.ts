import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const totalPatients = await prisma.patient.count()

const todayAppointments = await prisma.appointment.count({
where:{
date:{
gte:new Date(new Date().setHours(0,0,0,0))
}
}
})

const newPatients = await prisma.patient.count({
where:{
createdAt:{
gte:new Date(new Date().setDate(new Date().getDate()-7))
}
}
})

return NextResponse.json({
totalPatients,
todayAppointments,
newPatients
})

}