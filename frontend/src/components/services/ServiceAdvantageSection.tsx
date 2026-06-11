"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface AdvantageLink {
  label: string;
  href: string;
}

interface RichAdvantageItem {
  id: string;
  segments: { text: string; bold?: boolean }[];
}

interface ServiceAdvantageSectionProps {
  eyebrow?: string;
  heading?: string;
  tagline?: string;
  items?: string[];
  richItems?: RichAdvantageItem[];
  links?: AdvantageLink[];
}

export function ServiceAdvantageSection({
  eyebrow = "Why Crusoe",
  heading = "Advantage Crusoe",
  tagline,
  items,
  richItems,
  links,
}: ServiceAdvantageSectionProps) {
  return (
    <section
      aria-label={heading}
      className="section-padding relative overflow-hidden bg-transparent py-10 lg:py-12"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-20 top-0 h-[320px] w-[320px] rounded-full bg-brand/10 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 h-[260px] w-[260px] rounded-full bg-white/50 blur-[80px]" />
      </div>

      <div className="hero-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
            {eyebrow}
          </p>
          <h2 className="text-heading mt-2 text-[22px] sm:text-[26px] lg:text-[28px]">
            {heading}
          </h2>
          {tagline && (
            <p className="text-description mx-auto mt-3 max-w-2xl text-sm sm:text-base">
              {tagline}
            </p>
          )}
        </motion.div>

        {(items || richItems) && (
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items?.map((item, index) => (
              <motion.li
                key={item}
                variants={fadeUp}
                custom={index * 0.04}
                className="flex items-start gap-3 rounded-2xl border border-[#e7efe0] bg-white/85 px-4 py-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
                <span className="text-sm font-medium text-slate-700 sm:text-[15px]">
                  {item}
                </span>
              </motion.li>
            ))}
            {richItems?.map((item, index) => (
              <motion.li
                key={item.id}
                variants={fadeUp}
                custom={index * 0.04}
                className="flex items-start gap-3 rounded-2xl border border-[#e7efe0] bg-white/85 px-4 py-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
                <span className="text-sm text-slate-700 sm:text-[15px]">
                  {item.segments.map((segment) =>
                    segment.bold ? (
                      <strong key={`${item.id}-${segment.text}`}>
                        {segment.text}
                      </strong>
                    ) : (
                      <span key={`${item.id}-${segment.text}`}>
                        {segment.text}
                      </span>
                    )
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {links && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {links.map((link, index) => (
              <motion.div key={link.href} variants={fadeUp} custom={index * 0.06}>
                <Link
                  href={link.href}
                  className="group flex h-full items-center justify-between gap-4 rounded-[24px] border border-[#e7efe0] bg-white/90 px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_40px_rgba(126,168,73,0.12)]"
                >
                  <span className="text-heading text-base font-semibold sm:text-[17px]">
                    {link.label}
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
