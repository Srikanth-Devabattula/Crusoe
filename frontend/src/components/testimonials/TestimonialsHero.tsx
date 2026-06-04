"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function TestimonialsHero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <PageHeroOverlay />

      <motion.div
        className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.95fr] lg:gap-8 xl:gap-10">
          <motion.div
            className="order-2 text-center lg:order-1 lg:text-left"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>CLIENT SUCCESS STORIES</AnimatedBadge>
            </motion.div>

            <h1 className="text-heading mt-4 text-[28px] leading-[1.12] sm:text-[34px] lg:mt-5 lg:text-[38px] xl:text-[42px]">
              What Our Clients Say{" "}
              <span className="text-brand">About Us</span>
            </h1>

            <p className="text-description mx-auto mt-3 max-w-lg text-sm sm:text-base lg:mx-0 lg:mt-4">
              Hear from industry leaders who trust Crusoe Tech for reliable software
              quality and engineering solutions.
            </p>
          </motion.div>

          <motion.div
            className="relative order-1 flex justify-center lg:order-2 lg:justify-center lg:pl-4 xl:pl-8"
            custom={0.14}
            variants={fadeUp}
          >
            <div className="relative h-[200px] w-full max-w-[420px] sm:h-[220px] md:h-[240px] lg:h-[260px] lg:max-w-[460px] lg:-translate-x-6 xl:h-[280px] xl:-translate-x-10">
              <Image
                src="/images/hero/testimonials-hero.png"
                alt="Client testimonials illustration"
                fill
                priority
                sizes="(max-width: 1024px) 85vw, 460px"
                className="object-contain object-center"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
