"use client";

import { motion } from "framer-motion";
import {
  FaChartLine,
  FaHeadset,
  FaLock,
  FaRocket,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

import { whyChooseServices } from "@/data/servicesPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const iconMap = {
  users: FaUsers,
  rocket: FaRocket,
  shield: FaShieldAlt,
  lock: FaLock,
  chart: FaChartLine,
  headset: FaHeadset,
} as const;

export function ServicesWhyChooseSection() {
  return (
    <section
      aria-label="Why choose Crusoe"
      className="section-padding relative overflow-hidden"
    >
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="relative overflow-hidden rounded-[32px] border border-[#E8EEF5] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_45%,#f4f8fc_100%)] px-6 py-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-14 lg:px-14 lg:py-16"
        >
          {/* Glow Effects */}
          <div className="pointer-events-none absolute -left-24 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-brand/10 blur-[100px]" />
          <div className="pointer-events-none absolute -right-16 top-0 h-[240px] w-[240px] rounded-full bg-brand/5 blur-[80px]" />

          {/* Header */}
          <div className="relative z-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              WHY CHOOSE CRUSOE
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl lg:text-[34px]">
              Built for Quality. Designed for Results.
            </h2>
          </div>

          {/* Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="relative z-10 mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-12 lg:grid-cols-3 lg:gap-10"
          >
            {whyChooseServices.map((item, index) => {
              const Icon = iconMap[item.icon];

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={index * 0.06}
                  whileHover={{ y: -4 }}
                  className="group rounded-[20px] border border-[#E8EEF5] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-300 hover:border-brand/30 hover:shadow-[0_12px_40px_rgba(108,191,42,0.12)] sm:p-6"
                >
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}