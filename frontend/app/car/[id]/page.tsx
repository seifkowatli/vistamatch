"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { CarPersona } from "@/types"
import PremiumCarDisplay from "@/components/PremiumCarDisplay"
import TestDriveModal from "@/components/TestDriveModal"

export default function CarLifeStoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [car, setCar] = useState<CarPersona | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false)

  useEffect(() => {
    // Retrieve selected car from localStorage
    const storedCar = localStorage.getItem("selectedCar")
    if (storedCar) {
      const parsedCar = JSON.parse(storedCar)
      if (parsedCar.id === params.id) {
        setCar(parsedCar)
      }
    }

    // If no car in localStorage or ID doesn't match, we would fetch from API
    // For now, just set loading to false
    setIsLoading(false)
  }, [params.id])

  const handleStartConversation = () => {
    router.push(`/chat?carId=${params.id}`)
  }

  const handleBookTestDrive = () => {
    setIsTestDriveModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair mb-4">Car not found</h2>
          <button onClick={() => router.push("/match")} className="glow-button">
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6">
        <div className="text-sm uppercase tracking-widest mb-2">VISTA</div>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <PremiumCarDisplay car={car} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="luxury-card p-8"
          >
            <h1 className="text-3xl md:text-5xl font-playfair mb-6">
              {car.year} {car.model}
            </h1>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-xl italic">"I crossed 5,000 km with Ammar. I'm ready for one more journey..."</p>

              <h2 className="text-2xl font-playfair mt-8 mb-4">Emotional Tone</h2>
              <p>{car.emotionalTone}</p>

              <h2 className="text-2xl font-playfair mt-8 mb-4">Usage History</h2>
              <p>{car.usageHistory}</p>

              <h2 className="text-2xl font-playfair mt-8 mb-4">Visual Vibe</h2>
              <p>{car.visualVibe}</p>

              {car.notableMemories && car.notableMemories.length > 0 && (
                <>
                  <h2 className="text-2xl font-playfair mt-8 mb-4">Notable Memories</h2>
                  <ul>
                    {car.notableMemories.map((memory, index) => (
                      <li key={index}>{memory}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartConversation}
                className="glow-button flex-1"
              >
                Start Conversation
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookTestDrive}
                className="flex-1 px-8 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
                Book Test Drive
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      <TestDriveModal isOpen={isTestDriveModalOpen} onClose={() => setIsTestDriveModalOpen(false)} car={car} />
    </div>
  )
}
