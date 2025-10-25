"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AmbientBackgroundProps {
  theme?: "gears" | "fluid" | "sparks" | "hydraulic";
}

export default function AmbientBackground({
  theme = "hydraulic",
}: AmbientBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (theme === "hydraulic") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Gradient Mesh */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(214, 49, 47, 0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Pulsing Circles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/10"
            initial={{
              width: 100 + i * 100,
              height: 100 + i * 100,
              x: "50%",
              y: "50%",
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              // eslint-disable-next-line react-hooks/purity
              x: Math.random() * window.innerWidth,
              // eslint-disable-next-line react-hooks/purity
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              // eslint-disable-next-line react-hooks/purity
              y: [null, Math.random() * window.innerHeight],
              // eslint-disable-next-line react-hooks/purity
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              // eslint-disable-next-line react-hooks/purity
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(214, 49, 47, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(214, 49, 47, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    );
  }

  // Add other themes (gears, fluid, sparks) here
  return null;
}
