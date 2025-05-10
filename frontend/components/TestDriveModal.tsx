"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import type { CustomerPersona, CarPersona } from "@/types"
import CustomCalendar from "./CustomCalendar"
import PremiumCarDisplay from "./PremiumCarDisplay"
import PersonaAvatar from "./PersonaAvatar"

interface TestDriveModalProps {
  isOpen: boolean
  onClose: () => void
  car: CarPersona
}

const timeSlots = ["10:00 - 11:00", "11:30 - 12:30", "13:00 - 14:00", "14:30 - 15:30", "16:00 - 17:00", "17:30 - 18:30"]

export default function TestDriveModal({ isOpen, onClose, car }: TestDriveModalProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerPersona, setCustomerPersona] = useState<CustomerPersona | null>(null)
  const [currentStep, setCurrentStep] = useState<"date" | "time" | "confirm">("date")

  useEffect(() => {
    // Reset selections when modal opens
    if (isOpen) {
      setDate(new Date())
      setSelectedTimeSlot(null)
      setIsSubmitting(false)
      setCurrentStep("date")

      // Get customer persona from localStorage
      const storedPersona = localStorage.getItem("customerPersona")
      if (storedPersona) {
        setCustomerPersona(JSON.parse(storedPersona))
      }
    }
  }, [isOpen])

  // Calculate min and max dates (today to 14 days from now)
  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 14)

  // Filter out weekends
  const isWeekday = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6 // 0 is Sunday, 6 is Saturday
  }

  const handleNextStep = () => {
    if (currentStep === "date") {
      setCurrentStep("time")
    } else if (currentStep === "time" && selectedTimeSlot) {
      setCurrentStep("confirm")
    }
  }

  const handlePrevStep = () => {
    if (currentStep === "time") {
      setCurrentStep("date")
    } else if (currentStep === "confirm") {
      setCurrentStep("time")
    }
  }

  const handleSubmit = async () => {
    if (!date || !selectedTimeSlot || !customerPersona) {
      toast.error("Please select a date and time slot")
      return
    }

    setIsSubmitting(true)

    try {
      // Format the date
      const formattedDate = date.toISOString().split("T")[0]

      const response = await fetch("/api/book-test-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerPersona,
          carPersona: car,
          appointmentDate: formattedDate,
          appointmentTime: selectedTimeSlot,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to book test drive")
      }

      const data = await response.json()

      // Store booking data in localStorage for the success page
      localStorage.setItem(
        "testDriveBooking",
        JSON.stringify({
          car,
          date: formattedDate,
          time: selectedTimeSlot,
          reference: data.reference || `TD-${Date.now().toString().slice(-6)}`,
        }),
      )

      // Close modal and redirect to success page
      onClose()
      router.push("/appointment/success")
    } catch (error) {
      console.error("Error booking test drive:", error)
      toast.error("Failed to book test drive. Please try again.")
      setIsSubmitting(false)
    }
  }

  // If no customer persona, prompt to take quiz
  if (isOpen && !customerPersona) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-playfair mb-4 text-center">Persona Required</h2>
            <p className="text-gray-300 mb-6 text-center">
              To book a test drive, you need to complete the lifestyle quiz first.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  onClose()
                  router.push("/quiz")
                }}
                className="glow-button"
              >
                Take the Quiz
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-3xl font-playfair bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Book Your Test Drive
              </motion.h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress indicator */}
            <div className="w-full mb-8">
              <div className="flex justify-between mb-2">
                {["Select Date", "Choose Time", "Confirm"].map((step, index) => (
                  <div
                    key={step}
                    className={`text-sm ${
                      (index === 0 && currentStep === "date") ||
                      (index === 1 && currentStep === "time") ||
                      (index === 2 && currentStep === "confirm")
                        ? "text-blue-400 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: "0%" }}
                  animate={{
                    width: currentStep === "date" ? "33%" : currentStep === "time" ? "66%" : "100%",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === "date" && (
                <motion.div
                  key="date-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <PremiumCarDisplay car={car} />
                  </div>

                  <h3 className="text-xl font-medium mb-4">Select a Date</h3>
                  <div className="calendar-container bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                    <CustomCalendar
                      value={date}
                      onChange={setDate}
                      minDate={minDate}
                      maxDate={maxDate}
                      isDateDisabled={(date) => !isWeekday(date)}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === "time" && (
                <motion.div
                  key="time-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-2">Selected Date</h3>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                      <p className="text-lg text-blue-400">{formatDate(date)}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-medium mb-4">Select a Time Slot</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <motion.button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-4 rounded-lg transition-colors ${
                          selectedTimeSlot === slot
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {slot}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === "confirm" && (
                <motion.div
                  key="confirm-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium mb-2">Confirm Your Test Drive</h3>
                    <p className="text-gray-400">Please review your test drive details below</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    {customerPersona && (
                      <div className="text-center">
                        <PersonaAvatar persona={customerPersona} type="customer" size="md" />
                      </div>
                    )}

                    <div className="flex items-center">
                      <div className="w-16 h-px bg-blue-500/30"></div>
                      <div className="mx-4 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
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
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                      <div className="w-16 h-px bg-blue-500/30"></div>
                    </div>

                    <div className="text-center">
                      <PersonaAvatar persona={car} type="car" size="md" />
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vehicle:</span>
                      <span className="font-medium">
                        {car.year} {car.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="font-medium">{formatDate(date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="font-medium">{selectedTimeSlot}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 italic text-center">
                    A sales advisor will contact you to confirm your appointment and provide dealership details.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {currentStep !== "date" ? (
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}

              {currentStep !== "confirm" ? (
                <button
                  onClick={handleNextStep}
                  className="glow-button"
                  disabled={currentStep === "time" && !selectedTimeSlot}
                >
                  Continue
                </button>
              ) : (
                <button onClick={handleSubmit} className="glow-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
