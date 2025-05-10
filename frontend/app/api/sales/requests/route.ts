import { NextResponse } from "next/server"
import type { TestDriveRequest } from "@/types/sales"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "all"
    const status = searchParams.get("status") || "all"

    // In a real app, this would fetch from a database
    // For now, we'll return mock data
    const mockRequests: TestDriveRequest[] = [
      {
        id: "req_1",
        customerPersona: {
          id: "cust_1",
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
          socialLinks: {
            instagram: "https://instagram.com/prestigeexplorer",
          },
        },
        carPersona: {
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
          image: "/images/glc-coupe-front.jpg",
          color: "Obsidian Black",
        },
        appointmentDate: "2025-05-15",
        appointmentTime: "10:00 - 11:00",
        bookingTimestamp: "2025-05-10T14:30:00Z",
        status: "pending",
      },
      {
        id: "req_2",
        customerPersona: {
          id: "cust_2",
          lifestyleVibe: "Urban",
          emotionalDrivers: ["Luxury", "Technology", "Design"],
          dailyRoutine: "Executive",
          weekendPersonality: "Social butterfly",
          socialExpression: "LinkedIn professional",
          preferredCarTraits: ["Premium features", "Elegant design"],
          ownershipStyle: "Upgrade every 3 years",
          purchaseConcerns: ["Brand image", "Technology"],
          decisionBehavior: "Intuitive",
          brandRelationship: "Luxury seeker",
          personaType: "Urban Professional",
          description: "Values sophistication and cutting-edge technology. Image-conscious.",
          socialLinks: {
            linkedin: "https://linkedin.com/in/urbanprofessional",
          },
        },
        carPersona: {
          id: "car_4",
          model: "S-Class",
          year: 2023,
          modelIdentity: "Luxury",
          usageHistory: "Executive transport",
          ownershipStyle: "Corporate fleet",
          serviceBehavior: "Premium maintenance",
          emotionalTone: "Distinguished",
          visualVibe: "Elegant",
          interiorEnergy: "Opulent",
          notableMemories: ["VIP transportation", "Business summits"],
          drivingFeel: "Effortless",
          voice: "Sophisticated",
          matchScore: 88,
          matchExplanation: "Luxury focused, Premium comfort, Executive style",
          image: "/images/s-class.png",
          color: "Anthracite Blue",
        },
        appointmentDate: "2025-05-12",
        appointmentTime: "14:30 - 15:30",
        bookingTimestamp: "2025-05-08T09:15:00Z",
        status: "contacted",
        notes: "Customer is interested in financing options. Follow up with premium package details.",
      },
      {
        id: "req_3",
        customerPersona: {
          id: "cust_3",
          lifestyleVibe: "Sporty",
          emotionalDrivers: ["Performance", "Excitement", "Status"],
          dailyRoutine: "Entrepreneur",
          weekendPersonality: "Thrill seeker",
          socialExpression: "Car enthusiast forums",
          preferredCarTraits: ["High performance", "Sporty design"],
          ownershipStyle: "Collector",
          purchaseConcerns: ["Engine specs", "Driving experience"],
          decisionBehavior: "Passionate",
          brandRelationship: "Performance enthusiast",
          personaType: "Performance Seeker",
          description: "Lives for the thrill of driving. Values power and precision.",
        },
        carPersona: {
          id: "car_5",
          model: "AMG GT",
          year: 2022,
          modelIdentity: "Performance",
          usageHistory: "Weekend drives",
          ownershipStyle: "Enthusiast-owned",
          serviceBehavior: "Performance-tuned",
          emotionalTone: "Exhilarating",
          visualVibe: "Aggressive",
          interiorEnergy: "Race-inspired",
          notableMemories: ["Track days", "Mountain passes", "Autobahn runs"],
          drivingFeel: "Precise",
          voice: "Intense",
          matchScore: 95,
          matchExplanation: "Performance focused, Driving enthusiast appeal, Weekend thrill",
          image: "/images/amg-gt.png",
          color: "Solar Beam Yellow",
        },
        appointmentDate: "2025-05-18",
        appointmentTime: "11:30 - 12:30",
        bookingTimestamp: "2025-05-09T16:45:00Z",
        status: "completed",
        notes: "Customer was very impressed with the test drive. Discussing color options and performance packages.",
      },
      {
        id: "req_4",
        customerPersona: {
          id: "cust_4",
          lifestyleVibe: "Eco-conscious",
          emotionalDrivers: ["Sustainability", "Innovation", "Comfort"],
          dailyRoutine: "Tech professional",
          weekendPersonality: "Nature lover",
          socialExpression: "Environmental advocate",
          preferredCarTraits: ["Electric", "Cutting-edge tech"],
          ownershipStyle: "Early adopter",
          purchaseConcerns: ["Range", "Charging infrastructure"],
          decisionBehavior: "Research-driven",
          brandRelationship: "Tech enthusiast",
          personaType: "Eco Innovator",
          description: "Passionate about sustainable technology and forward-thinking design.",
        },
        carPersona: {
          id: "car_6",
          model: "EQS",
          year: 2023,
          modelIdentity: "Futuristic",
          usageHistory: "Daily commute",
          ownershipStyle: "Tech enthusiast",
          serviceBehavior: "Software updates",
          emotionalTone: "Forward-thinking",
          visualVibe: "Cutting-edge",
          interiorEnergy: "Digital sanctuary",
          notableMemories: ["Zero-emission journeys", "Tech showcases"],
          drivingFeel: "Silent",
          voice: "Innovative",
          matchScore: 91,
          matchExplanation: "Tech-forward, Environmentally conscious, Modern aesthetic",
          image: "/images/eqs.png",
          color: "High-Tech Silver",
        },
        appointmentDate: "2025-05-14",
        appointmentTime: "16:00 - 17:00",
        bookingTimestamp: "2025-05-07T11:20:00Z",
        status: "sold",
        notes:
          "Customer purchased the vehicle with all available tech packages. Very satisfied with the EV experience.",
      },
      {
        id: "req_5",
        customerPersona: {
          id: "cust_5",
          lifestyleVibe: "Family-oriented",
          emotionalDrivers: ["Safety", "Comfort", "Practicality"],
          dailyRoutine: "Family manager",
          weekendPersonality: "Family activities",
          socialExpression: "Family-focused",
          preferredCarTraits: ["Spacious", "Safe", "Comfortable"],
          ownershipStyle: "Long-term investment",
          purchaseConcerns: ["Safety ratings", "Space", "Reliability"],
          decisionBehavior: "Careful",
          brandRelationship: "Brand loyal",
          personaType: "Family Prioritizer",
          description: "Puts family needs first. Values safety, space, and reliability.",
        },
        carPersona: {
          id: "car_7",
          model: "GLE SUV",
          year: 2023,
          modelIdentity: "Family-friendly",
          usageHistory: "Family trips",
          ownershipStyle: "Family vehicle",
          serviceBehavior: "Regular maintenance",
          emotionalTone: "Dependable",
          visualVibe: "Substantial",
          interiorEnergy: "Comfortable",
          notableMemories: ["Family road trips", "School runs"],
          drivingFeel: "Secure",
          voice: "Reassuring",
          matchScore: 89,
          matchExplanation: "Family-focused, Spacious interior, Safety features",
          image: "/mercedes-gle-suv.png",
          color: "Lunar Blue",
        },
        appointmentDate: "2025-05-16",
        appointmentTime: "13:00 - 14:00",
        bookingTimestamp: "2025-05-10T10:15:00Z",
        status: "follow-up",
        notes: "Family is comparing with other SUVs. Need to highlight safety features and space advantages.",
      },
    ]

    // Filter by period
    let filteredRequests = [...mockRequests]

    if (period === "today") {
      const today = new Date().toISOString().split("T")[0]
      filteredRequests = filteredRequests.filter((req) => req.appointmentDate === today)
    } else if (period === "week") {
      const today = new Date()
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)

      filteredRequests = filteredRequests.filter((req) => {
        const appointmentDate = new Date(req.appointmentDate)
        return appointmentDate >= weekAgo && appointmentDate <= today
      })
    }

    // Filter by status
    if (status !== "all") {
      filteredRequests = filteredRequests.filter((req) => req.status === status)
    }

    return NextResponse.json(filteredRequests)
  } catch (error) {
    console.error("Error fetching sales requests:", error)
    return NextResponse.json({ error: "Failed to fetch sales requests" }, { status: 500 })
  }
}
