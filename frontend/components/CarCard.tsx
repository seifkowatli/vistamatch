"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { CarPersona } from "@/types"
import TestDriveModal from "./TestDriveModal"
import PremiumCarDisplay from "./PremiumCarDisplay"

interface CarCardProps {
  car: CarPersona
  showMatchScore?: boolean
  showConversationButton?: boolean
}

export default function CarCard({ car, showMatchScore = true, showConversationButton = true }: CarCardProps) {
  const router = useRouter()
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false)

  const handleViewStory = () => {
    // Store selected car in localStorage
    localStorage.setItem("selectedCar", JSON.stringify(car))
    router.push(`/car/${car.id}`)
  }

  const handleStartConversation = () => {
    // Store selected car in localStorage
    localStorage.setItem("selectedCar", JSON.stringify(car))
    router.push(`/chat?carId=${car.id}`)
  }

  const handleBookTestDrive = () => {
    setIsTestDriveModalOpen(true)
  }

  // Get match label based on score
  const getMatchLabel = () => {
    if (car.matchScore >= 90) return "Perfect"
    if (car.matchScore >= 80) return "Excellent"
    if (car.matchScore >= 70) return "Great"
    return "Good"
  }

  return (
    <>
      <motion.div
        className="luxury-card overflow-hidden h-full flex flex-col relative"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {/* Match score badge - positioned in the top right corner */}
        {showMatchScore && (
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
            >
              {/* Match score circle */}
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg border-2 border-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{car.matchScore}</div>
                  <div className="text-xs text-white/90">%</div>
                </div>
              </div>

              {/* Match label */}
              <motion.div
                className="mt-1 bg-blue-900 px-3 py-1 rounded-full text-xs text-white"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {getMatchLabel()}
              </motion.div>
            </motion.div>
          </div>
        )}

        <div className="p-4">
          <PremiumCarDisplay car={car} showBadge={false} />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-medium mb-1">
            {car.year} {car.model}
          </h3>

          <p className="text-gray-400 text-sm mb-4">{car.emotionalTone}</p>

          {showMatchScore && (
            <div className="flex flex-wrap gap-2 mb-6">
              {car.matchExplanation.split(", ").map((reason, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-blue-900/40 text-blue-300">
                  {reason}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto space-y-3">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewStory}
              className="w-full py-2 px-4 bg-primary/20 border border-primary/30 rounded-md text-white transition-colors"
            >
              View Story
            </motion.button>

            {showConversationButton && (
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartConversation}
                className="w-full py-2 px-4 bg-primary/20 border border-primary/30 rounded-md text-white transition-colors"
              >
                Start Conversation
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBookTestDrive}
              className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded-md text-white transition-colors flex items-center justify-center gap-2"
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
        </div>
      </motion.div>

      <TestDriveModal isOpen={isTestDriveModalOpen} onClose={() => setIsTestDriveModalOpen(false)} car={car} />
    </>
  )
}
