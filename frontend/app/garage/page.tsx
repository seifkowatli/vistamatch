"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import type { CarPersona } from "@/types"

interface Memory {
  id: string
  date: string
  title: string
  description: string
  image?: string
}

export default function MemoryGaragePage() {
  const router = useRouter()
  const [car, setCar] = useState<CarPersona | null>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve car from localStorage
    const storedCar = localStorage.getItem("selectedCar")

    if (storedCar) {
      setCar(JSON.parse(storedCar))

      // Mock memories data
      setMemories([
        {
          id: "1",
          date: "2023-05-15",
          title: "First Drive",
          description: "I crossed 5,000 km with Ammar. I'm ready for one more journey...",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "2",
          date: "2023-06-22",
          title: "Weekend Getaway",
          description: "We explored the coastal highway together, the wind in our hair.",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "3",
          date: "2023-08-10",
          title: "City Lights",
          description: "Late night drives through the illuminated cityscape.",
          image: "/placeholder.svg?height=300&width=400",
        },
      ])
    }

    setIsLoading(false)
  }, [])

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
          <h2 className="text-2xl font-playfair mb-4">No car selected</h2>
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
        <div className="text-sm uppercase tracking-widest mb-2">Memory Garage</div>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-playfair mb-12">Our Journey Together</h1>

          <div className="space-y-12">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="luxury-card p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={memory.image || "/placeholder.svg?height=300&width=400"}
                        alt={memory.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(memory.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    <h2 className="text-2xl font-playfair mb-4">{memory.title}</h2>

                    <p className="text-gray-300 italic">"{memory.description}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 italic">More memories await us on the road ahead...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
