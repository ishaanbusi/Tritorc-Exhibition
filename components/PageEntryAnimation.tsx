"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PageEntryAnimationProps {
  children: React.ReactNode;
  productName: string;
}

export default function PageEntryAnimation({
  children,
  productName,
}: PageEntryAnimationProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* Loading Screen with Product Reveal */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black z-50 flex items-center justify-center pointer-events-none"
        style={{ pointerEvents: isLoaded ? "none" : "auto" }}
      >
        <div className="relative px-6 w-full max-w-md">
          {/* Particle System */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#D6212F] rounded-full shadow-lg shadow-[#D6212F]/50"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x:
                    Math.cos((i / 20) * Math.PI * 2) *
                    (window.innerWidth < 640 ? 120 : 200),
                  y:
                    Math.sin((i / 20) * Math.PI * 2) *
                    (window.innerWidth < 640 ? 120 : 200),
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Glow Effect Behind Text */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-[#D6212F] rounded-full blur-3xl" />
          </motion.div>

          {/* Product Name Reveal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {productName}
            </h1>
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              Loading Experience
            </p>
          </motion.div>

          {/* Loading Bar Container */}
          <div className="relative z-10 mt-8 sm:mt-10">
            <motion.div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#D6212F] to-[#FF4757] rounded-full shadow-lg shadow-[#D6212F]/50"
              />
            </motion.div>

            {/* Loading Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-center mt-3 text-sm text-gray-500 font-medium"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                0%
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1 }}
              >
                {" → 50%"}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                {" → 100%"}
              </motion.span>
            </motion.div>
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D6212F] to-transparent"
          />
        </div>
      </motion.div>

      {/* Main Content with Stagger Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
