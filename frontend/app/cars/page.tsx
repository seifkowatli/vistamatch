"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import type { CarPersona } from "@/types"
import CarCard from "@/components/CarCard"

export default function CarsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromMatch = searchParams.get("fromMatch") === "true"
  const [cars, setCars] = useState<CarPersona[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasPersona, setHasPersona] = useState(false)

  useEffect(() => {
    async function fetchCars() {
      try {
        // First try to get cars from the API
        const response = await fetch("/api/cars")

        if (!response.ok) {
          throw new Error("Failed to fetch cars from API")
        }

        const data = await response.json()

        // Sort by match score if coming from match page
        if (fromMatch) {
          setCars([...data].sort((a, b) => b.matchScore - a.matchScore))
        } else {
          setCars(data)
        }
      } catch (error) {
        console.error("Error fetching cars:", error)

        // Fallback: Use mock data when API fails
        const fallbackCars = [
          {
            id: "car_1",
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
            matchScore: 78,
            matchExplanation: "Luxury focused, Premium comfort, Executive style",
            image: "/images/s-class.png",
            color: "Anthracite Blue",
          },
          {
            id: "car_2",
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
            matchScore: 72,
            matchExplanation: "Performance focused, Driving enthusiast appeal, Weekend thrill",
            image: "/images/amg-gt.png",
            color: "Solar Beam Yellow",
          },
          {
            id: "car_3",
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
            matchScore: 89,
            matchExplanation: "Tech-forward, Environmentally conscious, Modern aesthetic",
            image: "/images/eqs.png",
            color: "High-Tech Silver",
          },
          {
            id: "car_4",
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
            image: "/images/glc-coupe-front.avif",
            color: "Obsidian Black",
          },
          {
            id: "car_5",
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
            id: "car_",
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
            image: "/images/cls.jpg",
            color: "Designo Diamond White",
          }
        ]

        // Sort by match score if coming from match page
        if (fromMatch) {
          setCars([...fallbackCars].sort((a, b) => b.matchScore - a.matchScore))
        } else {
          setCars(fallbackCars)
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Check if user has a persona
    const storedPersona = localStorage.getItem("customerPersona")
    setHasPersona(!!storedPersona)

    fetchCars()
  }, [fromMatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-20 h-20 relative mb-8">
          <motion.div
            className="w-full h-full rounded-full border-4 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>
        <p className="text-gray-400">Loading Mercedes-Benz collection...</p>
      </div>
    )
  }

  // Determine if we should show match scores and conversation buttons
  // Only show them if user has a persona and is coming from match page
  const showMatchFeatures = hasPersona && fromMatch

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-white/10">
        <div className="text-sm uppercase tracking-widest mb-2">VISTA</div>
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>

          <h1 className="text-2xl md:text-3xl font-playfair">Mercedes-Benz Collection</h1>

          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
          >
            {showMatchFeatures
              ? "Explore your matched Mercedes-Benz vehicles, each with its own unique personality and compatibility score."
              : "Explore our curated collection of Mercedes-Benz vehicles, each with its own unique personality and story. Take the lifestyle quiz to find your perfect match."}
          </motion.p>

          {!hasPersona && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/quiz")}
                className="glow-button"
              >
                Take Lifestyle Quiz
              </motion.button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CarCard car={car} showMatchScore={showMatchFeatures} showConversationButton={showMatchFeatures} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
