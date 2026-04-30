
import { NextResponse } from "next/server"
import { getAvailableSlotsWithMeta } from "@/lib/slots"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const doctorId = searchParams.get("doctorId")
  const date = searchParams.get("date")

  if (!doctorId || !date) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    )
  }

  const result = await getAvailableSlotsWithMeta(
    parseInt(doctorId, 10),
    new Date(date)
  )

  return NextResponse.json({
    slots: result.slots.map((s) => s.toISOString()),
    total: result.total,
    available: result.available,
    isAlmostFull: result.isAlmostFull,
    nextAvailable: result.slots[0]?.toISOString() ?? null,
  })
}