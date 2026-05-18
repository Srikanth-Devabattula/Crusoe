"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { ROUTES } from "@/constants";
import { CTAButton } from "@/components/hero/CTAButton";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { TrustedLogos } from "@/components/hero/TrustedLogos";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-14 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-28">
      <HeroBackground />

      <motion.div
        className="hero-container relative z-10"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] lg:gap-6 xl:gap-8"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div
            className="relative order-1 w-full min-w-0 lg:order-2 lg:pl-2 xl:pl-4"
            custom={0.12}
            variants={fadeUp}
          >
            <HeroSlider />
          </motion.div>

          <motion.div
            className="order-2 w-full text-center lg:order-1 lg:pr-2 lg:text-left xl:pr-4"
            custom={0.2}
            variants={fadeUp}
          >
            <motion.div
              custom={0.05}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/80 px-4 py-2 text-xs text-gray-600 shadow-sm backdrop-blur-sm lg:text-[11px]"
            >
              <Sparkles className="h-4 w-4 text-brand" strokeWidth={2} />
              <span>Software Quality, Engineered to Perfection.</span>
            </motion.div>

            <motion.h1
              custom={0.12}
              variants={fadeUp}
              className="mt-6 text-[32px] font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-[44px] lg:text-[38px] xl:text-[46px] 2xl:text-[50px]"
            >
              Building Reliable Software.{" "}
              <span className="text-brand">Delivering Real Impact.</span>
            </motion.h1>

            <motion.p
              custom={0.2}
              variants={fadeUp}
              className="mt-5 text-xs leading-relaxed text-gray-600 sm:text-sm lg:max-w-2xl lg:text-[13px] xl:max-w-none"
            >
              We deliver quality assurance, test automation, CAD customization
              and software tooling solutions that drive performance, reliability
              and business growth.
            </motion.p>

            <motion.div
              custom={0.28}
              variants={fadeUp}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <CTAButton href={ROUTES.services} variant="primary">
                Explore Our Services
              </CTAButton>
              <CTAButton href={ROUTES.about} variant="secondary">
                About Us
              </CTAButton>
            </motion.div>

            <TrustedLogos className="lg:text-left [&_ul]:justify-center lg:[&_ul]:justify-start" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
