"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import type { QuizStep as QuizStepType } from "@/types"

interface QuizStepProps {
  step: QuizStepType
  onComplete: (value: any) => void
}

interface RankedItem {
  id: string
  label: string
  value: string
}

export default function QuizStep({ step, onComplete }: QuizStepProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [sliderValue, setSliderValue] = useState(
    step.sliderConfig ? (step.sliderConfig.max - step.sliderConfig.min) / 2 : 0,
  )

  // Convert options to ranked items for the ranked list
  const initialRankedItems: RankedItem[] = step.options
    ? step.options.map((option) => ({
        id: option.id,
        label: option.label,
        value: option.value,
      }))
    : []

  const [rankedItems, setRankedItems] = useState<RankedItem[]>(initialRankedItems)

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    setTimeout(() => {
      onComplete(optionId)
    }, 500)
  }

  const handleSliderComplete = () => {
    onComplete(sliderValue)
  }

  const handleRankingComplete = () => {
    onComplete(rankedItems.slice(0, 3).map((item) => item.id))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="w-full" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h2 className="text-3xl md:text-5xl font-playfair mb-12" variants={itemVariants}>
        {step.question}
      </motion.h2>

      {step.type === "multiple-choice" && (
        <motion.div className="space-y-4" variants={containerVariants}>
          {step.options?.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => handleOptionSelect(option.value)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                selectedOption === option.value
                  ? "border-primary bg-primary/20"
                  : "border-white/10 hover:border-white/30"
              }`}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              custom={index}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {step.type === "image-choice" && (
        <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
          {step.options?.map((option, index) => {
            // Use the appropriate image based on the option value
            let imagePath = "/placeholder.svg?height=200&width=200"
            if (option.value === "prestige") {
              imagePath = "/images/aesthetic-prestige.png"
            } else if (option.value === "sporty") {
              imagePath = "/images/aesthetic-sporty.png"
            } else if (option.value === "minimal") {
              imagePath = "/images/aesthetic-minimal.png"
            } else if (option.value === "flashy") {
              imagePath = "/images/aesthetic-flashy.png"
            }

            return (
              <motion.div
                key={option.id}
                onClick={() => handleOptionSelect(option.value)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  selectedOption === option.value
                    ? "border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "border-transparent hover:border-white/30"
                }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                <div className="relative h-48">
                  <Image src={option.image || imagePath} alt={option.label} fill className="object-cover" />
                </div>
                <div className="p-3 text-center bg-gray-900">{option.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {step.type === "slider" && step.sliderConfig && (
        <motion.div className="space-y-8" variants={containerVariants}>
          <motion.div className="flex justify-between text-sm text-gray-400" variants={itemVariants}>
            <span>{step.sliderConfig.leftLabel}</span>
            <span>{step.sliderConfig.rightLabel}</span>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <input
              type="range"
              min={step.sliderConfig.min}
              max={step.sliderConfig.max}
              step={step.sliderConfig.step}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />

            <motion.div
              className="absolute -top-8 left-0 bg-primary/20 border border-primary/30 px-2 py-1 rounded text-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                left: `calc(${(sliderValue / step.sliderConfig.max) * 100}% - 1rem)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {sliderValue}
            </motion.div>
          </motion.div>

          <motion.div className="flex justify-center mt-8" variants={itemVariants}>
            <motion.button
              onClick={handleSliderComplete}
              className="glow-button"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {step.type === "ranked-list" && (
        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.p className="text-gray-400" variants={itemVariants}>
            Drag to rank your top 3 priorities
          </motion.p>

          <Reorder.Group axis="y" values={rankedItems} onReorder={setRankedItems} className="space-y-2">
            <AnimatePresence>
              {rankedItems.map((item, index) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: index < 3 ? "rgba(59, 130, 246, 0.1)" : "transparent",
                    borderColor: index < 3 ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.1)",
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  whileDrag={{
                    scale: 1.03,
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                  }}
                  className="flex items-center justify-between p-4 rounded-lg border cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center">
                    {index < 3 && (
                      <motion.span
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-grip-vertical"
                    >
                      <circle cx="9" cy="12" r="1" />
                      <circle cx="9" cy="5" r="1" />
                      <circle cx="9" cy="19" r="1" />
                      <circle cx="15" cy="12" r="1" />
                      <circle cx="15" cy="5" r="1" />
                      <circle cx="15" cy="19" r="1" />
                    </svg>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <motion.div className="flex justify-center mt-8" variants={itemVariants}>
            <motion.button
              onClick={handleRankingComplete}
              className="glow-button"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
