import { NextResponse } from "next/server"
import type { CarPersona } from "@/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerPersonaId = searchParams.get("customerPersonaId")

    if (!customerPersonaId) {
      return NextResponse.json({ error: "Customer persona ID is required" }, { status: 400 })
    }

    // In a real app, this would query a database or AI service to find matches
    // For now, we'll return mock data
    const carMatches: CarPersona[] = [
      {
        id: "car_1",
        model: "GLC 300 Coupe",
        year: 2021,
        modelIdentity: "Executive",
        usageHistory: "City-driven",
        ownershipStyle: "Single-owner",
        serviceBehavior: "Regularly maintained",
        emotionalTone: "Loyal Companion",
        visualVibe: "Sleek",
        interiorEnergy: "Tech-heavy",
        notableMemories: ["Long coastal drives", "City nights"],
        drivingFeel: "Smooth",
        voice: "Confident",
        matchScore: 93,
        matchExplanation: "Perfect for city driving, Matches your aesthetic, Aligns with your values",
        image: "/images/glc-coupe.png",
        color: "Obsidian Black",
      },
      {
        id: "car_2",
        model: "E-Class",
        year: 2022,
        modelIdentity: "Classic",
        usageHistory: "Long-distance",
        ownershipStyle: "Single-owner",
        serviceBehavior: "Fully documented",
        emotionalTone: "Nostalgic",
        visualVibe: "Understated",
        interiorEnergy: "Minimalist",
        notableMemories: ["Business trips", "Family vacations"],
        drivingFeel: "Relaxed",
        voice: "Wise",
        matchScore: 81,
        matchExplanation: "Great for comfort, Ideal for long drives, Matches your weekend style",
        image: "/images/e-class.png",
        color: "Selenite Grey",
      },
      {
        id: "car_3",
        model: "CLS",
        year: 2020,
        modelIdentity: "Sporty",
        usageHistory: "Light use",
        ownershipStyle: "Collector-owned",
        serviceBehavior: "Regularly maintained",
        emotionalTone: "Wild Spirit",
        visualVibe: "Bold",
        interiorEnergy: "Driver-focused",
        notableMemories: ["Track days", "Mountain passes"],
        drivingFeel: "Aggressive",
        voice: "Playful",
        matchScore: 85,
        matchExplanation: "Perfect for spirited driving, Matches your bold style, Great for adventures",
        image: "/images/cls.png",
        color: "Designo Diamond White",
      },
    ]

    return NextResponse.json(carMatches)
  } catch (error) {
    console.error("Error getting car matches:", error)
    return NextResponse.json({ error: "Failed to get car matches" }, { status: 500 })
  }
}
