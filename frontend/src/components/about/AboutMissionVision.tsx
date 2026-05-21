"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiEye, FiTarget } from "react-icons/fi";

import { missionVision } from "@/data/aboutPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const iconMap = {
  target: FiTarget,
  eye: FiEye,
} as const;

export function AboutMissionVision() {
  return (
    <section aria-label="Mission and vision" className="section-padding bg-[#F7F9F4]">
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid gap-6 lg:grid-cols-2 lg:gap-8"
        >
          {missionVision.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.article
                key={item.title}
                variants={fadeUp}
                custom={index * 0.08}
                whileHover={{ y: -6 }}
                className="group rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#ffffff_0%,#f6fbf2_100%)] p-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_20px_56px_rgba(108,191,42,0.12)] sm:p-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="text-heading mt-6 text-xl sm:text-2xl">{item.title}</h3>
                <p className="text-description mt-4 text-sm leading-relaxed sm:text-base">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Learn More
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
