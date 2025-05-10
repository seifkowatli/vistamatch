"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import type { CarPersona, CustomerPersona } from "@/types"

export default function ConnectedPage() {
  const router = useRouter()
  const [car, setCar] = useState<CarPersona | null>(null)
  const [customerPersona, setCustomerPersona] = useState<CustomerPersona | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve car and customer persona from localStorage
    const storedCar = localStorage.getItem("selectedCar")
    const storedPersona = localStorage.getItem("customerPersona")

    if (storedCar) {
      setCar(JSON.parse(storedCar))
    }

    if (storedPersona) {
      setCustomerPersona(JSON.parse(storedPersona))
    }

    setIsLoading(false)
  }, [])

  const handleTrackJourney = () => {
    // In a real app, this would navigate to a journey tracking page
    alert("Journey tracking functionality would be implemented here")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!car || !customerPersona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair mb-4">Connection not found</h2>
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
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-playfair text-center mb-12"
          >
            You're Connected
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="luxury-card p-6"
            >
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Customer Avatar"
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl font-playfair mb-2">{customerPersona.personaType}</h2>

              <p className="text-gray-400 mb-4">{customerPersona.description}</p>

              <div className="flex flex-wrap gap-2">
                {customerPersona.emotionalDrivers.slice(0, 3).map((driver, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                    {driver}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="luxury-card p-6"
            >
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={car.image || "/placeholder.svg?height=300&width=400"}
                  alt={`${car.year} ${car.model}`}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl font-playfair mb-2">
                {car.year} {car.model}
              </h2>

              <p className="text-gray-400 mb-4">{car.emotionalTone}</p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                  {car.modelIdentity}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                  {car.visualVibe}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                  {car.drivingFeel}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrackJourney}
            className="glow-button mx-auto block mt-12"
          >
            Track My Journey
          </motion.button>
        </div>
      </main>
    </div>
  )
}
