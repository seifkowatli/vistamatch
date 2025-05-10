"use client"

import { motion } from "framer-motion"

interface QuizProgressProps {
  currentStep: number
  totalSteps: number
}

export default function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  return (
    <div className="mb-8">
      <motion.div
        className="text-2xl md:text-3xl font-playfair mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        key={currentStep}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        Step {currentStep} of {totalSteps}
      </motion.div>
      <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${index < currentStep ? "bg-primary" : "bg-gray-600"}`}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: index === currentStep - 1 ? 1.5 : 1,
              opacity: index < currentStep ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
