"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { CarPersona } from "@/types"

interface PremiumCarDisplayProps {
  car: CarPersona
  showBadge?: boolean
}

export default function PremiumCarDisplay({ car, showBadge = true }: PremiumCarDisplayProps) {
  const [activeView, setActiveView] = useState<"front" | "rear" | "interior">("front")

  // Get the appropriate car images based on the model
const getCarImages = () => {
  if (car?.model && car.model.includes("GLC")) {
    return {
      front: "/images/glc-coupe-front.avif",
      rear: "/images/glc-coupe-front.avif",
      interior: "/images/glc-coupe-interior.png",
    }
  }
  return {
    front: car?.image || "/placeholder.svg?height=500&width=800&query=luxury car front view",
    rear: "/placeholder.svg?height=500&width=800&query=luxury car rear view",
    interior: "/placeholder.svg?height=500&width=800&query=luxury car interior",
  }
}

  const carImages = getCarImages()

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl">
        <motion.div className="relative w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
          <Image
            src={carImages[activeView] || "/placeholder.svg"}
            alt={`${car.year} ${car.model} ${activeView} view`}
            fill
            className="object-cover shadow-lg"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Badge overlay */}
          {showBadge && (
            <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
              {car.model} {car.year}
            </div>
          )}
        </motion.div>
      </div>

      {/* View selector */}
      <div className="flex justify-center space-x-2">
        {(["front", "rear", "interior"] as const).map((view) => (
          <motion.button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-20 h-12 rounded-md overflow-hidden border-2 transition-all ${
              activeView === view ? "border-blue-500 scale-105" : "border-transparent opacity-70"
            }`}
            whileHover={{ scale: 1.05, opacity: 1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-full h-full">
              <Image
                src={carImages[view] || "/placeholder.svg"}
                alt={`${view} thumbnail`}
                fill
                className="object-cover"
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
