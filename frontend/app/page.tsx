"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"

export default function HomePage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredAll, setIsHoveredAll] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const logoRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(logoRef, { once: false })
  const logoControls = useAnimation()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isInView) {
      logoControls.start("visible")
    }
  }, [isInView, logoControls])

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.2,
      },
    },
  }

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5 + i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    }),
  }

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
        >
          {/* Background gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-gradient-radial from-blue-900/20 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12 relative z-10"
          >
            <motion.div
              ref={logoRef}
              initial="hidden"
              animate={logoControls}
              variants={logoVariants}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="relative mx-auto mb-12 w-32 h-32 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              {/* Logo glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
                animate={{
                  scale: isLogoHovered ? 1.2 : 1,
                  opacity: isLogoHovered ? 0.7 : 0.3,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Logo container with 3D effect */}
              <motion.div
                className="relative w-full h-full"
                animate={{
                  rotateY: isLogoHovered ? [0, 10, 0, -10, 0] : 0,
                }}
                transition={{
                  duration: isLogoHovered ? 2 : 0.5,
                  repeat: isLogoHovered ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              >
                <Image
                  src="/images/mercedes-logo-homepage.png"
                  alt="Mercedes-Benz Logo"
                  width={200}
                  height={200}
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Animated stars around logo */}
              {[...Array(5)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 5
                const x = Math.cos(angle) * 70
                const y = Math.sin(angle) * 70
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={starVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  />
                )
              })}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-playfair mb-8"
            >
              Find Your <span className="gradient-text">Mercedes</span> Soulmate
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Discover the perfect Mercedes-Benz that matches your lifestyle, personality, and aspirations.
            </motion.p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 z-10">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => router.push("/quiz")}
              className="glow-button relative overflow-hidden group"
            >
              <span className="relative z-10">Start Lifestyle Match</span>
              <motion.div
                className="absolute inset-0 bg-blue-500 opacity-0"
                animate={{ opacity: isHovered ? 0.2 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHoveredAll(true)}
              onMouseLeave={() => setIsHoveredAll(false)}
              onClick={() => router.push("/cars")}
              className="px-8 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <span className="relative z-10">View All Cars</span>
            </motion.button>
          </div>

          {/* Floating elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.3, duration: 1 }}
            className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
