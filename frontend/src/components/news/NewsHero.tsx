"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { HERO_BG_IMAGE } from "@/data/heroSlides";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function NewsHero() {
  return (
    <section className="relative overflow-hidden bg-[#eef4e8]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image src={HERO_BG_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/75 to-white/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#eef4e8]/90" />
      </div>

      <motion.div
        className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mx-auto max-w-3xl text-center" custom={0.08} variants={fadeUp}>
          <motion.div custom={0.05} variants={fadeUp}>
            <AnimatedBadge>COMPANY NEWS</AnimatedBadge>
          </motion.div>
          <motion.h1
            className="mt-5 text-[2rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.5rem] lg:text-[2.75rem]"
            custom={0.12}
            variants={fadeUp}
          >
            Latest news & announcements
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
            custom={0.18}
            variants={fadeUp}
          >
            Stay up to date with company updates, press releases, and industry news from Crusoe Tech.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
