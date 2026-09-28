"use client";

import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

import { cultureFeatures } from "@/data/aboutPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function AboutCulture() {
  return (
    <section aria-label="Our culture" className="section-padding bg-[#F7F9F4]">
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            OUR CULTURE
          </p>
          <h2 className="text-heading mt-3 text-2xl leading-tight sm:text-3xl lg:text-[34px]">
            People First, Innovation Always.
          </h2>
          <p className="text-description mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-[15px]">
            We foster a culture where engineers, designers, and consultants collaborate
            openly — learning continuously, delivering with integrity, and celebrating
            together with our global partners.
          </p>
          <ul className="mx-auto mt-8 inline-flex max-w-md flex-col items-start gap-3.5 text-left sm:mt-9 sm:gap-4">
            {cultureFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <FiCheckCircle className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-sm font-semibold text-[#111827] sm:text-[15px]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/*
 * --- Previous Our Culture layout (photo grid) ---
 * To restore images: uncomment `cultureImages` in aboutPage.ts and use the
 * two-column grid block from git history / earlier commit.
 *
 * export const cultureImages = [
 *   "/images/aboutus/about3.png",
 *   ...
 * ];
 */
