import { NextResponse } from "next/server"
import type { CustomerPersona, CarPersona } from "@/types"

interface TestDriveRequest {
  customerPersona: CustomerPersona
  carPersona: CarPersona
  appointmentDate: string
  appointmentTime: string
}

export async function POST(request: Request) {
  try {
    const data: TestDriveRequest = await request.json()

    // Validate required fields
    if (!data.customerPersona || !data.carPersona || !data.appointmentDate || !data.appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, this would:
    // 1. Save the test drive request to a database
    // 2. Send notifications to the sales team (email, Slack, CRM, etc.)
    // 3. Return a confirmation to the user

    console.log("Test drive booked:", {
      customer: data.customerPersona.personaType,
      car: `${data.carPersona.year} ${data.carPersona.model}`,
      date: data.appointmentDate,
      time: data.appointmentTime,
    })

    // Simulate a slight delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Test drive booked successfully",
      reference: `TD-${Date.now().toString().slice(-6)}`,
      details: {
        car: `${data.carPersona.year} ${data.carPersona.model}`,
        date: data.appointmentDate,
        time: data.appointmentTime,
      },
    })
  } catch (error) {
    console.error("Error booking test drive:", error)
    return NextResponse.json({ error: "Failed to book test drive" }, { status: 500 })
  }
}
