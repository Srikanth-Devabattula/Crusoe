"use client";

import { motion } from "framer-motion";
import {
  FiAward,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import { coreValues } from "@/data/aboutPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const iconMap = {
  zap: FiZap,
  shield: FiShield,
  check: FiCheckCircle,
  users: FiUsers,
  award: FiAward,
  trending: FiTrendingUp,
} as const;

export function AboutCoreValues() {
  return (
    <section
      id="core-values"
      aria-label="Core values"
      className="section-padding scroll-mt-24 bg-[#F7F9F4]"
    >
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="text-center"
        >
          <h2 className="text-heading text-2xl sm:text-3xl lg:text-[34px]">
            OUR CORE VALUES
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {coreValues.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.article
                key={item.title}
                variants={fadeUp}
                custom={index * 0.05}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-[#e7efe0] bg-white p-6 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all hover:border-brand/30 hover:shadow-[0_12px_40px_rgba(126, 168, 73,0.12)] sm:p-8"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#111827]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
