"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { ROUTES } from "@/constants";
import { HERO_BG_IMAGE } from "@/data/heroSlides";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-[#eef4e8]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={HERO_BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/75 to-white/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#eef4e8]/90" />
      </div>

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
              className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,191,42,0.35)] transition hover:bg-brand-dark sm:text-base"
            >
              View open positions
            </a>
            <Link
              href={ROUTES.contact}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur transition hover:border-brand/40 hover:text-brand sm:text-base"
            >
              Contact us
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
