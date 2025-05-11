'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-black text-white"
        >
          {/* Background glow blobs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
            className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05 }}
            className="relative mx-auto mb-12 w-32 h-32"
          >
            <Image
              src="/images/mercedes-logo-homepage.png"
              alt="Mercedes-Benz Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-playfair mb-6 text-center"
          >
            Find Your <span className="text-blue-400">Mercedes</span> Soulmate
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto text-center mb-10"
          >
            Discover the perfect Mercedes-Benz that matches your lifestyle, personality, and aspirations.
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 z-10">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{
                scale: 1.06,
                boxShadow: '0 0 20px rgba(59,130,246,0.8)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/quiz')}
              className="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold transition"
            >
              Start Lifestyle Match
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/cars')}
              className="px-8 py-3 rounded-full border border-white/20 hover:border-white/40 text-white transition"
            >
              View All Cars
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
