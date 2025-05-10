"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import PremiumCarDisplay from "@/components/PremiumCarDisplay"
import type { CarPersona } from "@/types"

interface BookingDetails {
  car: CarPersona
  date: string
  time: string
  reference: string
}

export default function AppointmentSuccessPage() {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Get booking details from localStorage
    const storedBooking = localStorage.getItem("testDriveBooking")
    if (storedBooking) {
      setBooking(JSON.parse(storedBooking))
    } else {
      // If no booking details, redirect to home
      router.push("/")
    }

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <AnimatePresence>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  scale: Math.random() * 0.5 + 0.5,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: Math.random() * 2 + 3,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  backgroundColor: [
                    "#3B82F6", // blue
                    "#10B981", // green
                    "#F59E0B", // yellow
                    "#EF4444", // red
                    "#8B5CF6", // purple
                  ][Math.floor(Math.random() * 5)],
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <header className="p-6">
        <div className="text-sm uppercase tracking-widest mb-2">VISTA</div>
        <button
          onClick={() => router.push("/match")}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Matches
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2,
              }}
              className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/20 rounded-full mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-playfair mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Appointment <span className="gradient-text">Booked</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              A sales advisor will contact you shortly.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="luxury-card p-6 md:p-8 mb-8"
          >
            <h2 className="text-2xl font-playfair mb-6">Your Test Drive Details</h2>

            <div className="mb-6">
              <PremiumCarDisplay car={booking.car} />
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Reference Number</span>
                <span className="font-medium text-blue-400">{booking.reference}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Vehicle</span>
                <span className="font-medium">
                  {booking.car.year} {booking.car.model}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Date</span>
                <span className="font-medium">{formatDate(booking.date)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Time</span>
                <span className="font-medium">{booking.time}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/match")}
              className="glow-button"
            >
              Return to Matches
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/car/${booking.car.id}`)}
              className="px-8 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              View Car Journey
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
