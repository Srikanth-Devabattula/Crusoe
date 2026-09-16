"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiUsers } from "react-icons/fi";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";
import { ABOUT_HERO_IMAGE, storyParagraphs, storyTitle } from "@/data/aboutPage";

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
    <section id="our-story" className="relative scroll-mt-24 overflow-hidden bg-transparent">
      <PageHeroOverlay>
        <DottedPattern />
      </PageHeroOverlay>

      <motion.div
        className="hero-container relative z-10 pb-10 pt-[5.25rem] sm:pb-12 sm:pt-[5.75rem] lg:pb-14 lg:pt-[6.25rem] xl:pb-16"
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-8 xl:gap-12">
          <motion.div
            className="order-2 w-full min-w-0 text-center lg:order-1 lg:max-w-xl lg:text-left xl:max-w-2xl"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>OUR STORY</AnimatedBadge>
            </motion.div>

            <h1 className="text-heading mt-4 text-[28px] leading-[1.12] sm:text-[34px] lg:mt-5 lg:text-[36px] xl:text-[42px]">
              {storyTitle}
            </h1>

            <div className="mx-auto mt-4 max-w-lg space-y-4 lg:mx-0 lg:mt-5">
              {storyParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-description text-sm leading-relaxed sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <motion.div
              custom={0.12}
              variants={fadeUp}
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <Link
                href="#our-journey"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-hero-cta transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_14px_36px_rgba(126,168,73,0.35)] sm:w-auto"
              >
                Our Journey
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#leadership"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-brand shadow-sm transition-all duration-300 hover:border-brand/30 hover:bg-brand-muted/40 sm:w-auto"
              >
                <FiUsers className="h-4 w-4" />
                Meet the Team
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 w-full min-w-0 lg:order-2"
            custom={0.14}
            variants={fadeUp}
          >
            <div className="relative mx-auto w-full lg:mx-0">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[32px] border border-[#e7efe0] shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:aspect-[16/9] lg:aspect-[2/1]">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 z-10 h-40 w-40 rounded-full bg-brand/15 blur-3xl"
                  aria-hidden
                />
                <FloatingOrb
                  className="absolute left-6 top-8 z-10 h-3 w-3 rounded-full bg-brand/60"
                  delay={0.3}
                />

                <Image
                  src={ABOUT_HERO_IMAGE}
                  alt="Crusoe Technologies engineering innovation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
