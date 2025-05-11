"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { CarPersona } from "@/types"
import CarCard from "@/components/CarCard"
import { fetchCarMatchesFromStrapi } from "@/lib/match"

export default function MatchPage() {
  const router = useRouter()
  const [carMatches, setCarMatches] = useState<CarPersona[]>([])
  const [isLoading, setIsLoading] = useState(true)
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

useEffect(() => {
  fetchCarMatchesFromStrapi()
    .then((matches) => {
      const sorted = matches.sort((a, b) => b.matchScore - a.matchScore)
      setCarMatches(sorted)
    })
    .catch((err) => {
      console.error("Matching error:", err)
    })
    .finally(() => setIsLoading(false))
}, [])


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!carMatches.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair mb-4">No matches found</h2>
          <button onClick={() => router.push("/quiz")} className="glow-button">
            Take the Quiz Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6">
        <div className="text-sm uppercase tracking-widest mb-2">Car Match</div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-playfair mb-4 md:mb-0">Your Perfect Mercedes Match</h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/cars?fromMatch=true")}
              className="px-6 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              View All Matches
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carMatches.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
