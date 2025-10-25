"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Generate stable random values outside component
const generateParticles = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    colorType: i % 3,
    initialX: Math.random() * 1920,
    initialY: Math.random() * 1080,
    x1: Math.random() * 1920,
    y1: Math.random() * 1080,
    x2: Math.random() * 1920,
    y2: Math.random() * 1080,
    duration: Math.random() * 15 + 15,
    delay: Math.random() * 5,
  }));
};

const PARTICLES = generateParticles();

export default function AmbientBackground() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Background Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />

      {/* Ambient Glow Orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D6212F]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#D6212F]/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D6212F]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Floating Particles */}
      {PARTICLES.map((particle) => {
        const getColor = () => {
          if (particle.colorType === 0) return "rgba(214, 33, 47, 0.3)";
          if (particle.colorType === 1) return "rgba(214, 33, 47, 0.2)";
          return "rgba(255, 255, 255, 0.1)";
        };

        const hasShadow = particle.colorType === 0;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size + "px",
              height: particle.size + "px",
              backgroundColor: getColor(),
              boxShadow: hasShadow ? "0 0 10px rgba(214, 33, 47, 0.3)" : "none",
            }}
            initial={{
              x: particle.initialX,
              y: particle.initialY,
            }}
            animate={{
              x: [particle.initialX, particle.x1, particle.x2],
              y: [particle.initialY, particle.y1, particle.y2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        );
      })}

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(214, 33, 47, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(214, 33, 47, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
