"use client";

import { motion } from "framer-motion";

const PARTICLES = [
  { size: 5, top: "14%", left: "10%", delay: 0 },
  { size: 4, top: "32%", left: "20%", delay: 0.5 },
  { size: 4, top: "68%", left: "14%", delay: 1 },
  { size: 3, top: "22%", left: "75%", delay: 0.3 },
  { size: 5, top: "48%", left: "90%", delay: 0.8 },
];

export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/35" />

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-brand/40 shadow-[0_0_8px_rgba(126, 168, 73,0.35)]"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
