"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiAward,
  FiGlobe,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { ABOUT_IMAGE, storyParagraphs, storyStats } from "@/data/aboutPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

import { FloatingOrb } from "./AboutDecor";

const statIconMap = {
  users: FiUsers,
  trending: FiTrendingUp,
  award: FiAward,
  globe: FiGlobe,
} as const;

export function AboutStorySection() {
  return (
    <section
      id="our-story"
      aria-label="Our story"
      className="section-padding scroll-mt-24 bg-white"
    >
      <div className="hero-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#f6fbf2_0%,#ffffff_100%)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand/15 blur-3xl" />
              <FloatingOrb
                className="absolute left-6 top-8 h-3 w-3 rounded-full bg-brand/60"
                delay={0.3}
              />
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
                <Image
                  src={ABOUT_IMAGE}
                  alt="Crusoe company story"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.08}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              OUR STORY
            </p>
            <h2 className="text-heading mt-3 text-2xl sm:text-3xl lg:text-[34px]">
              Building Reliable Engineering Solutions Since 2015
            </h2>
            <div className="mt-5 space-y-4">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-description text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {storyStats.map((stat, index) => {
                const Icon = statIconMap[stat.icon];
                return (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    custom={index * 0.05}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl border border-[#e7efe0] bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(108,191,42,0.1)] sm:p-5"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="mt-3 text-xl font-bold text-[#111827] sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
