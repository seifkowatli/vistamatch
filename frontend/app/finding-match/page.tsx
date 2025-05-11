"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { CustomerPersona } from "@/types"
import { getCarMatches } from "@/lib/api"
import { fetchCarMatchesFromStrapi } from "@/lib/match" // ✅ use the correct function

export default function FindingMatchPage() {
  const router = useRouter()
  const [customerPersona, setCustomerPersona] = useState<CustomerPersona | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStartedFetch, setHasStartedFetch] = useState(false)

  const loadingMessages = [
    "Analyzing your lifestyle preferences...",
    "Scanning the Mercedes-Benz collection...",
    "Calculating compatibility scores...",
    "Preparing your perfect matches...",
    "Almost there, finalizing your results...",
  ]

  // Load customer persona only once on component mount
  useEffect(() => {
    // Retrieve customer persona from localStorage
    const storedPersona = localStorage.getItem("customerPersona")
    if (storedPersona) {
      setCustomerPersona(JSON.parse(storedPersona))
    } else {
      // If no persona, redirect to quiz
      router.push("/quiz")
    }
  }, [router])

  // Handle loading progress simulation
  useEffect(() => {
    if (!customerPersona) return

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsComplete(true)
          return 100
        }
        return prev + 0.5
      })
    }, 50)

    return () => {
      clearInterval(progressInterval)
    }
  }, [customerPersona])

  // Handle loading phase changes
  useEffect(() => {
    if (!customerPersona) return

    const phaseInterval = setInterval(() => {
      setLoadingPhase((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(phaseInterval)
          return prev
        }
        return prev + 1
      })
    }, 3000)

    return () => {
      clearInterval(phaseInterval)
    }
  }, [customerPersona, loadingMessages.length])

  // Fetch car matches once
useEffect(() => {
  if (hasStartedFetch) return

  const fetch = async () => {
    try {
      setHasStartedFetch(true)
      const matches = await fetchCarMatchesFromStrapi()
      localStorage.setItem("carMatches", JSON.stringify(matches))
    } catch (err) {
      console.error("Match error:", err)
    }
  }

  fetch()
}, [hasStartedFetch])

  // Redirect to match page when loading is complete
  useEffect(() => {
    if (isComplete) {
      const redirectTimer = setTimeout(() => {
        router.push("/match")
      }, 1000)

      return () => clearTimeout(redirectTimer)
    }
  }, [isComplete, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="z-10 max-w-3xl w-full text-center">
        {/* Logo */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Image
            src="/images/mercedes-logo-homepage.png"
            alt="Mercedes-Benz Logo"
            fill
            className="object-contain "
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-playfair mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Finding Your Perfect <span className="gradient-text">Match</span>
        </motion.h1>

        {/* Loading message */}
        <div className="h-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingPhase}
              className="text-lg text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {loadingMessages[loadingPhase]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-12">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
            style={{ width: `${loadingProgress}%` }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-white/20"
            animate={{
              x: ["-100%", "500%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        {/* Car silhouette animation */}
        <div className="relative h-32 mb-12">
          <motion.div
            className="absolute left-0 w-full h-full flex items-center justify-center"
            initial={{ x: "-100%" }}
            animate={{ x: isComplete ? "100%" : ["100%", "-100%"] }}
            transition={{
              duration: isComplete ? 1.5 : 5,
              repeat: isComplete ? 0 : Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <svg
              width="200"
              height="60"
              viewBox="0 0 200 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            >
              <path
                d="M196 40H180L170 25H130L120 15H80L70 25H30L20 40H4C2.89543 40 2 40.8954 2 42V45C2 46.1046 2.89543 47 4 47H20C20 53.6274 25.3726 59 32 59C38.6274 59 44 53.6274 44 47H156C156 53.6274 161.373 59 168 59C174.627 59 180 53.6274 180 47H196C197.105 47 198 46.1046 198 45V42C198 40.8954 197.105 40 196 40Z"
                stroke="white"
                strokeWidth="3"
              />
              <circle cx="32" cy="47" r="10" stroke="white" strokeWidth="3" />
              <circle cx="168" cy="47" r="10" stroke="white" strokeWidth="3" />
            </svg>
          </motion.div>
        </div>

        {/* Sexy message */}
        <motion.p
          className="text-xl md:text-2xl font-playfair text-gray-300 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          "The perfect car doesn't just match your lifestyle—it completes your identity."
        </motion.p>
      </div>
    </div>
  )
}
