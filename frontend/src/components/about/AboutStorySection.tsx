"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { ABOUT_STORY_IMAGE, storyParagraphs } from "@/data/aboutPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

import { FloatingOrb } from "./AboutDecor";

export function AboutStorySection() {
  return (
    <section
      id="our-story"
      aria-label="Our story"
      className="section-padding scroll-mt-24 bg-transparent"
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
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[24px]">
                <Image
                  src={ABOUT_STORY_IMAGE}
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
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-description text-justify text-sm sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
