"use client";

import { motion } from "framer-motion";
import { FiCpu, FiGlobe, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

import { timelineMilestones } from "@/data/aboutPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

const iconMap = {
  rocket: HiOutlineRocketLaunch,
  shield: FiShield,
  globe: FiGlobe,
  cpu: FiCpu,
  trending: FiTrendingUp,
  zap: FiZap,
} as const;

export function AboutTimeline() {
  return (
    <section
      id="our-journey"
      aria-label="Our journey"
      className="section-padding scroll-mt-24 bg-white"
    >
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            OUR JOURNEY
          </p>
          <h2 className="text-heading mt-3 text-2xl sm:text-3xl lg:text-[34px]">
            Milestones that shaped Crusoe Technologies
          </h2>
        </motion.div>

        <div className="relative mx-auto mt-12 max-w-4xl lg:mt-16">
          <div
            className="absolute bottom-0 left-4 top-0 w-0.5 bg-gradient-to-b from-brand/20 via-brand to-brand/20 lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden
          />

          <ul className="space-y-8 lg:space-y-12">
            {timelineMilestones.map((item, index) => {
              const Icon = iconMap[item.icon];
              const isLeft = index % 2 === 0;

              return (
                <motion.li
                  key={item.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeUp}
                  custom={index * 0.06}
                  className="relative pl-12 lg:pl-0"
                >
                  <div
                    className="absolute left-2 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-brand shadow-[0_0_0_4px_rgba(108,191,42,0.25)] lg:left-1/2 lg:-translate-x-1/2"
                    aria-hidden
                  />

                  <div
                    className={`lg:w-[calc(50%-2rem)] ${
                      isLeft
                        ? "lg:mr-auto lg:pr-8 lg:text-right"
                        : "lg:ml-auto lg:pl-8 lg:text-left"
                    }`}
                  >
                    <motion.article
                      whileHover={{ y: -4 }}
                      className={`rounded-3xl border border-[#e7efe0] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_16px_48px_rgba(108,191,42,0.1)] sm:p-6 ${
                        isLeft ? "lg:ml-auto" : "lg:mr-auto"
                      } max-w-md`}
                    >
                      <div
                        className={`flex items-start gap-4 ${
                          isLeft ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                          <Icon className="h-5 w-5" aria-hidden />
                        </div>
                        <div className={isLeft ? "lg:text-right" : ""}>
                          <p className="text-sm font-bold text-brand">{item.year}</p>
                          <h3 className="mt-1 text-lg font-semibold text-[#111827]">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
