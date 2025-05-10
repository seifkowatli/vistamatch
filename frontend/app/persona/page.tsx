"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { CustomerPersona } from "@/types"

export default function PersonaPage() {
  const router = useRouter()
  const [customerPersona, setCustomerPersona] = useState<CustomerPersona | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    // Retrieve customer persona from localStorage
    const storedPersona = localStorage.getItem("customerPersona")
    if (storedPersona) {
      setCustomerPersona(JSON.parse(storedPersona))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 20)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  const handleContinue = async () => {
    if (!customerPersona) return

    // Redirect to the finding-match page instead of directly to match
    router.push("/finding-match")
  }

  // Get persona image based on type
  const getPersonaImage = () => {
    if (!customerPersona) return "/placeholder.svg?height=300&width=300"

    if (customerPersona.personaType.includes("Prestige")) {
      return "/images/aesthetic-prestige.png"
    } else if (customerPersona.personaType.includes("Sport")) {
      return "/images/aesthetic-sporty.png"
    } else if (customerPersona.personaType.includes("Minimal")) {
      return "/images/aesthetic-minimal.png"
    } else if (customerPersona.personaType.includes("Flash")) {
      return "/images/aesthetic-flashy.png"
    }

    return "/placeholder.svg?height=300&width=300"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-20 h-20 relative mb-8">
          <Image
            src="/images/mercedes-logo.png"
            alt="Mercedes-Benz Logo"
            fill
            className="object-contain animate-pulse"
          />
        </div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-gray-400">Finding your perfect match...</p>
      </div>
    )
  }

  if (!customerPersona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair mb-4">No persona found</h2>
          <button onClick={() => router.push("/quiz")} className="glow-button">
            Take the Quiz
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

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="luxury-card w-full max-w-2xl p-8 relative overflow-hidden"
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="text-sm uppercase tracking-widest mb-4">VÉVOÁR</div>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <motion.div
                className="md:w-1/3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src={getPersonaImage() || "/placeholder.svg"}
                    alt={customerPersona.personaType}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Social links */}
                {customerPersona.socialLinks && (
                  <div className="mt-4 flex justify-center space-x-4">
                    {customerPersona.socialLinks.instagram && (
                      <motion.a
                        href={customerPersona.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </motion.a>
                    )}
                    {customerPersona.socialLinks.linkedin && (
                      <motion.a
                        href={customerPersona.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </motion.a>
                    )}
                  </div>
                )}
              </motion.div>

              <div className="md:w-2/3">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-playfair mb-6"
                >
                  You're a <span className="gradient-text">{customerPersona.personaType}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-xl text-gray-300 mb-6"
                >
                  {customerPersona.description}
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {customerPersona.emotionalDrivers.map((driver, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm"
                >
                  {driver}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex justify-center"
            >
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <motion.svg
                    key={star}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                    className="w-6 h-6 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="glow-button w-full mt-8"
            >
              Find My Car Match
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
