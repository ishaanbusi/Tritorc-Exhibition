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
        className="fixed inset-0 bg-black z-50 flex items-center justify-center pointer-events-none"
        style={{ pointerEvents: isLoaded ? "none" : "auto" }}
      >
        <div className="relative">
          {/* Particle System */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos((i / 20) * Math.PI * 2) * 200,
                  y: Math.sin((i / 20) * Math.PI * 2) * 200,
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

          {/* Product Name Reveal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl font-bold text-white text-center"
          >
            {productName}
          </motion.div>

          {/* Loading Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-primary mt-6 rounded-full"
          />
        </div>
      </motion.div>

      {/* Main Content with Stagger Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
