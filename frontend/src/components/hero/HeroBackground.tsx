"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { HERO_BG_IMAGE } from "@/data/heroSlides";

const PARTICLES = [
  { size: 5, top: "14%", left: "10%", delay: 0 },
  { size: 4, top: "32%", left: "20%", delay: 0.5 },
  { size: 4, top: "68%", left: "14%", delay: 1 },
  { size: 3, top: "22%", left: "75%", delay: 0.3 },
  { size: 5, top: "48%", left: "90%", delay: 0.8 },
];

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div style={{ y: parallaxY }} className="absolute inset-0">
        <Image
          src={HERO_BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-brand/40 shadow-[0_0_8px_rgba(108,191,42,0.35)]"
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
    </motion.div>
  );
}
