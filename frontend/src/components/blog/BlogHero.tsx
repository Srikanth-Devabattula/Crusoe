"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <PageHeroOverlay />

      <motion.div
        className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mx-auto max-w-3xl text-center" custom={0.08} variants={fadeUp}>
          <motion.div custom={0.05} variants={fadeUp}>
            <AnimatedBadge>OUR BLOG</AnimatedBadge>
          </motion.div>

          <motion.h1
            className="mt-5 text-[2rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.5rem] lg:text-[2.75rem]"
            custom={0.12}
            variants={fadeUp}
          >
            Insights, stories & updates
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
            custom={0.18}
            variants={fadeUp}
          >
            Explore articles on technology, engineering, and how we build products
            that matter.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
