"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { generateCustomerAttributes } from "@/lib/api"
import type { QuizResults } from "@/types"
import QuizStep from "@/components/QuizStep"
import QuizProgress from "@/components/QuizProgress"

const quizSteps = [
  {
    id: "weekend",
    question: "What's your weekend vibe?",
    type: "multiple-choice",
    options: [
      { id: "adventure", label: "Road trip & adventure", value: "adventure" },
      { id: "city", label: "Brunch & city stroll", value: "city" },
      { id: "recharge", label: "Netflix & recharge", value: "recharge" },
      { id: "gym", label: "Gym & grind", value: "gym" },
    ],
  },
  {
    id: "aesthetic",
    question: "Pick your vibe aesthetic.",
    type: "image-choice",
    options: [
      {
        id: "prestige",
        label: "Prestige / Classic",
        value: "prestige",
        image: "/images/aesthetic-prestige.png",
      },
      {
        id: "sporty",
        label: "Sporty / Bold",
        value: "sporty",
        image: "/images/aesthetic-sporty.png",
      },
      {
        id: "minimal",
        label: "Minimal / Zen",
        value: "minimal",
        image: "/images/aesthetic-minimal.png",
      },
      {
        id: "flashy",
        label: "Flashy / High-profile",
        value: "flashy",
        image: "/images/aesthetic-flashy.png",
      },
    ],
  },
  {
    id: "decision",
    question: "How do you usually make decisions?",
    type: "slider",
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      leftLabel: "Instinctive",
      rightLabel: "Analytical",
    },
  },
  {
    id: "influences",
    question: "Who influences your car choices the most?",
    type: "multiple-choice",
    options: [
      { id: "self", label: "It's all me", value: "self" },
      { id: "family", label: "Family / Partner", value: "family" },
      { id: "social", label: "Social media trends", value: "social" },
      { id: "friends", label: "Friends or mentors", value: "friends" },
    ],
  },
  {
    id: "values",
    question: "Which of these do you value most in a car?",
    type: "ranked-list",
    options: [
      { id: "comfort", label: "Comfort", value: "comfort" },
      { id: "performance", label: "Performance", value: "performance" },
      { id: "design", label: "Design", value: "design" },
      { id: "tech", label: "Tech & Features", value: "tech" },
      { id: "prestige", label: "Brand prestige", value: "prestige" },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [quizResults, setQuizResults] = useState<Partial<QuizResults>>({})
  const [instagramLink, setInstagramLink] = useState("")
  const [linkedinLink, setLinkedinLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + 2
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isSubmitting])

  const handleStepComplete = (stepId: string, value: any) => {
    setQuizResults((prev) => ({ ...prev, [stepId]: value }))

    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    setIsSubmitting(true)
    setLoadingProgress(0)

    try {
      const finalResults = {
        ...quizResults,
        instagramLink: instagramLink || undefined,
        linkedinLink: linkedinLink || undefined,
      } as QuizResults

      const customerPersona = await generateCustomerAttributes(finalResults)

      // Store the customer persona in localStorage for now
      localStorage.setItem("customerPersona", JSON.stringify(customerPersona))

      router.push("/persona")
    } catch (error) {
      console.error("Error completing quiz:", error)
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-20 h-20 relative mb-8">
          <Image
            src="/images/mercedes-logo.png"
            alt="Mercedes-Benz Logo"
            width={80}
            height={80}
            className="object-contain animate-pulse"
          />
        </div>

        <h2 className="text-2xl font-playfair mb-6 text-center">Analyzing Your Preferences</h2>

        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-gray-400 text-center">Creating your unique Mercedes-Benz persona...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6">
        <div className="text-sm uppercase tracking-widest mb-2">VISTA</div>
        <QuizProgress currentStep={currentStep + 1} totalSteps={quizSteps.length} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl"
          >
            <QuizStep
              step={quizSteps[currentStep]}
              onComplete={(value) => handleStepComplete(quizSteps[currentStep].id, value)}
            />
          </motion.div>
        </AnimatePresence>

        {currentStep === quizSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8 w-full max-w-md space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Instagram profile (optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                    className="text-gray-500"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md pl-10 px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">LinkedIn profile (optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                    className="text-gray-500"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md pl-10 px-4 py-2 text-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
