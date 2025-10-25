"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ComparisonSlider({
  before,
  after,
  alt = "",
}: {
  before: string;
  after: string;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0.5);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-black select-none"
    >
      <img
        src={after}
        alt={alt}
        className="block w-full pointer-events-none opacity-90"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - x * 100}% 0 0)` }}
      >
        <img
          src={before}
          alt={alt}
          className="block w-full pointer-events-none"
        />
      </div>

      <motion.div
        className="absolute inset-y-0 w-0.5 bg-white/70"
        style={{ left: `${x * 100}%` }}
        drag="x"
        dragMomentum={false}
        dragConstraints={ref}
        onDrag={(e, info) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          const next = (info.point.x - rect.left) / rect.width;
          setX(Math.max(0, Math.min(1, next)));
        }}
      />
      <div
        className="absolute inset-0"
        onPointerDown={(e) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          const next = (e.clientX - rect.left) / rect.width;
          setX(Math.max(0, Math.min(1, next)));
        }}
      />
    </div>
  );
}
