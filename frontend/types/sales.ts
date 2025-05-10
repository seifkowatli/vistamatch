import type { CustomerPersona, CarPersona } from "@/types"

export type RequestStatus = "pending" | "contacted" | "completed" | "sold" | "lost" | "follow-up"

export interface TestDriveRequest {
  id: string
  customerPersona: CustomerPersona
  carPersona: CarPersona
  appointmentDate: string
  appointmentTime: string
  bookingTimestamp: string
  status: RequestStatus
  notes?: string
}

export interface SalesFilter {
  period: "today" | "week" | "all"
  status?: RequestStatus | "all"
}
