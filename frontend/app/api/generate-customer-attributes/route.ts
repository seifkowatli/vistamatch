import { NextResponse } from "next/server"
import type { CustomerPersona } from "@/types"

export async function POST(request: Request) {
  try {
    const quizResults = await request.json()

    // In a real app, this would call an AI service to generate the persona
    // For now, we'll return a mock response
    const customerPersona: CustomerPersona = {
      id: "cust_" + Date.now().toString(),
      lifestyleVibe: "Explorer",
      emotionalDrivers: ["Freedom", "Status", "Comfort"],
      dailyRoutine: "City commuter",
      weekendPersonality: "Adventure seeker",
      socialExpression: "Instagram aesthetics",
      preferredCarTraits: ["Responsive drive", "Bold design"],
      ownershipStyle: "Long-term keeper",
      purchaseConcerns: ["Performance", "Resale value"],
      decisionBehavior: "Analytical",
      brandRelationship: "Mercedes enthusiast",
      personaType: "Prestige Explorer",
      description: "Likes bold lines, quiet confidence. Emotionally expressive.",
      // Store social media links if provided
      socialLinks: {
        instagram: quizResults.instagramLink,
        linkedin: quizResults.linkedinLink,
      },
    }

    return NextResponse.json(customerPersona)
  } catch (error) {
    console.error("Error generating customer attributes:", error)
    return NextResponse.json({ error: "Failed to generate customer attributes" }, { status: 500 })
  }
}
