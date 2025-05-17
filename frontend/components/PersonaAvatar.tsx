"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { CustomerPersona, CarPersona } from "@/types"

interface PersonaAvatarProps {
  persona: CustomerPersona | CarPersona
  type: "customer" | "car"
  isActive?: boolean
  size?: "sm" | "md" | "lg"
}

export default function PersonaAvatar({ persona, type, isActive = false, size = "md" }: PersonaAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine avatar image based on persona type
  const getAvatarImage = () => {
    if (type === "customer") {
      const customerPersona = persona as CustomerPersona
      if (customerPersona.personaType?.includes("Explorer")) {
        return "/images/persona-urban-explorer.png"
      } else if (customerPersona.personaType?.includes("Prestige")) {
        return "/images/persona-prestige-seeker.png"
      }
      return "/images/profile-avatar.png"
    } else {
      const carPersona = persona as CarPersona
      if (carPersona.model.includes("GLC")) {
        return "/images/mercedes-badge.png"
      }
      return carPersona.image || "/images/mercedes-logo.png"
    }
  }

  // Get persona name/title
  const getPersonaTitle = () => {
    if (type === "customer") {
      return (persona as CustomerPersona).personaType || "Customer"
    } else {
      const car = persona as CarPersona
      return `${car.year} ${car.model}`
    }
  }

  // Get persona tags
  const getPersonaTags = () => {
    if (type === "customer") {
      return (persona as CustomerPersona).emotionalDrivers?.slice(0, 2) || []
    } else {
      const car = persona as CarPersona
      return [car.modelIdentity, car.emotionalTone].filter(Boolean)
    }
  }

  // Size classes
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const containerSizeClasses = {
    sm: "max-w-[200px]",
    md: "max-w-[250px]",
    lg: "max-w-[300px]",
  }

  return (
    <motion.div
      className={`flex flex-col items-center ${containerSizeClasses[size]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <motion.div
          className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/20`}
          animate={{
            borderColor: isActive ? "rgba(59, 130, 246, 0.8)" : "rgba(255, 255, 255, 0.2)",
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Image src={getAvatarImage() || "/placeholder.svg"} alt={getPersonaTitle()} fill className="object-cover" />
        </motion.div>

        {/* Animated border for active state */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-blue-500`}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
              borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.3)"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        )}
      </div>

      {size !== "sm" && (
        <div className="mt-2 text-center">
          <h4 className="text-sm font-medium">{getPersonaTitle()}</h4>

          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {/* {getPersonaTags().map((tag, index) => (
              <span key={index} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300">
                {tag}
              </span>
            ))} */}
          </div>
        </div>
      )}
    </motion.div>
  )
}
