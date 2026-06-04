"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiUsers } from "react-icons/fi";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";
import { ABOUT_IMAGE } from "@/data/aboutPage";

import { DottedPattern, FloatingOrb } from "./AboutDecor";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <PageHeroOverlay>
        <DottedPattern />
      </PageHeroOverlay>

      <motion.div
        className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.95fr] lg:gap-8 xl:gap-10">
          <motion.div
            className="order-2 text-center lg:order-1 lg:text-left"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>ABOUT CRUSOE</AnimatedBadge>
            </motion.div>

            <h1 className="text-heading mt-4 text-[28px] leading-[1.12] sm:text-[34px] lg:mt-5 lg:text-[38px] xl:text-[42px]">
              Engineering Innovation
              <br />
              <span className="text-brand">Driven by Passion</span>
            </h1>

            <p className="text-description mx-auto mt-3 max-w-lg text-sm sm:text-base lg:mx-0 lg:mt-4">
              Since 2015, Crusoe Technologies has been helping businesses accelerate
              growth through innovative software engineering, QA automation, and
              enterprise solutions.
            </p>

            <motion.div
              custom={0.12}
              variants={fadeUp}
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link
                href="#our-journey"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand px-6 py-3.5 text-[13px] font-semibold text-white shadow-hero-cta transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_14px_36px_rgba(126, 168, 73,0.35)] sm:px-7 sm:py-4 lg:text-xs"
              >
                Our Journey
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#leadership"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-[13px] font-semibold text-brand shadow-sm transition-all duration-300 hover:border-brand/30 hover:bg-brand-muted/40 sm:px-7 sm:py-4 lg:text-xs"
              >
                <FiUsers className="h-4 w-4" />
                Meet the Team
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 flex justify-center lg:order-2 lg:justify-center lg:pl-4 xl:pl-8"
            custom={0.14}
            variants={fadeUp}
          >
            <div className="relative h-[200px] w-full max-w-[420px] sm:h-[220px] md:h-[240px] lg:h-[260px] lg:max-w-[460px] lg:-translate-x-6 xl:h-[280px] xl:-translate-x-10">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/15"
                aria-hidden
              />
              <FloatingOrb
                className="absolute left-[6%] top-[20%] h-3 w-3 rounded-full bg-brand shadow-[0_0_12px_rgba(126, 168, 73,0.5)] sm:h-4 sm:w-4"
              />
              <FloatingOrb
                className="absolute right-[10%] top-[25%] h-5 w-5 rounded-full bg-white shadow-md ring-2 ring-brand/20 sm:h-6 sm:w-6"
                delay={0.7}
              />
              <FloatingOrb
                className="absolute bottom-[20%] left-[15%] h-4 w-4 rounded-full bg-brand/70"
                delay={1.1}
              />
              <motion.div
                className="relative h-full w-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={ABOUT_IMAGE}
                  alt="Crusoe Technologies team"
                  fill
                  priority
                  sizes="(max-width: 1024px) 85vw, 460px"
                  className="object-contain object-center drop-shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
