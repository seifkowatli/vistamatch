import type { CustomerPersona, CarPersona } from "@/types"

const API_BASE_URL = "/api"

export async function generateCustomerAttributes(quizResults: Record<string, any>): Promise<CustomerPersona> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-customer-attributes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizResults),
    })

    if (!response.ok) {
      throw new Error("Failed to generate customer attributes")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating customer attributes:", error)
    throw error
  }
}

export async function getCarMatches(customerPersonaId: string): Promise<CarPersona[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/match?customerPersonaId=${customerPersonaId}`)

    if (!response.ok) {
      throw new Error("Failed to get car matches")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting car matches:", error)
    throw error
  }
}

export async function sendChatMessage(
  role: "car" | "sales",
  persona: Record<string, any> | string,
  message: string
): Promise<{ reply: string }> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role,
      persona,
      messages: [{ role: "user", content: message }]
    }),
  })

  if (!res.ok) {
    throw new Error("Failed to send chat message")
  }

  return await res.json()
}


