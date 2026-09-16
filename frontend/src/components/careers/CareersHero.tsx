"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ApplyToUsModal } from "@/components/careers/ApplyToUsModal";
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

export function CareersHero() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-transparent">
        <PageHeroOverlay />

        <motion.div
          className="hero-container relative z-10 pb-10 pt-[5.25rem] sm:pb-12 sm:pt-[5.75rem] lg:pb-14 lg:pt-[6.25rem]"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="mx-auto max-w-3xl text-center"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>CAREERS</AnimatedBadge>
            </motion.div>

            <motion.h1
              className="mt-5 text-[2rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.5rem] lg:text-[2.75rem]"
              custom={0.12}
              variants={fadeUp}
            >
              Build your career with Crusoe Tech
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
              custom={0.18}
              variants={fadeUp}
            >
              Explore open roles across engineering, design, and delivery. Find a
              position that fits your skills and apply in minutes.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
              custom={0.24}
              variants={fadeUp}
            >
              <a
                href="#open-positions"
                className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(126,168,73,0.35)] transition hover:bg-brand-dark sm:text-base"
              >
                View open positions
              </a>
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur transition hover:border-brand/40 hover:text-brand sm:text-base"
              >
                Apply to us
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <ApplyToUsModal open={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </>
  );
}
