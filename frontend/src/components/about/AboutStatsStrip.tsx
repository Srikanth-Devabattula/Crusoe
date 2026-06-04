"use client";

import { useEffect, useRef } from "react";
import { motion, animate, useInView } from "framer-motion";
import { FiAward, FiGlobe, FiTrendingUp, FiUsers } from "react-icons/fi";

import { statsStrip } from "@/data/aboutPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

const iconMap = {
  users: FiUsers,
  trending: FiTrendingUp,
  globe: FiGlobe,
  award: FiAward,
} as const;

function Counter({
  value,
  suffix,
  start,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  start: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !start) return;

    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = Math.round(latest).toString();
      },
    });

    return () => controls.stop();
  }, [value, start, delay]);

  return (
    <span className="tabular-nums text-2xl font-bold text-[#111827] sm:text-3xl">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function AboutStatsStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section aria-label="Company statistics" className="section-padding bg-transparent pb-8 lg:pb-12">
      <div className="hero-container">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf2_50%,#eef8e7_100%)] px-6 py-10 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:px-10 sm:py-12"
        >
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
            {statsStrip.map((stat, index) => {
              const Icon = iconMap[stat.icon];
              return (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="mt-4">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      start={isInView}
                      delay={index * 0.1}
                    />
                  </div>
                  <p className="mt-2 text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
