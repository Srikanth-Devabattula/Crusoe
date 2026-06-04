"use client";

import { motion } from "framer-motion";
import { ROUTES } from "@/constants";
import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { CTAButton } from "@/components/hero/CTAButton";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroSlider } from "@/components/hero/HeroSlider";

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
    <section className="relative overflow-hidden bg-transparent pb-14 pt-[7.5rem] sm:pb-16 sm:pt-[8.5rem] lg:pb-16 lg:pt-[8rem] desktop:pb-28 desktop:pt-[9.5rem]">
      <HeroBackground />

      <motion.div
        className="hero-container relative z-10"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-5 desktop:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] desktop:gap-8"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div
            className="relative order-1 w-full min-w-0 lg:order-2 lg:justify-self-stretch desktop:pl-2"
            custom={0.12}
            variants={fadeUp}
          >
            <HeroSlider />
          </motion.div>

          <motion.div
            className="order-2 w-full max-w-none text-center lg:order-1 lg:max-w-[22rem] lg:pr-2 lg:text-left desktop:max-w-none desktop:pr-4"
            custom={0.2}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge className="[&>div]:px-3 [&>div]:py-1.5 [&>div]:text-[10px] desktop:[&>div]:px-4 desktop:[&>div]:py-2 desktop:[&>div]:text-[11px]">
                Software Quality, Engineered to Perfection.
              </AnimatedBadge>
            </motion.div>

            <motion.h1
              custom={0.12}
              variants={fadeUp}
              className="text-heading mt-5 text-[30px] leading-[1.1] sm:mt-6 sm:text-[36px] lg:mt-4 lg:text-[30px] lg:leading-[1.12] desktop:mt-6 desktop:text-[44px] desktop:leading-[1.08] 2xl:text-[50px]"
            >
              Building Reliable Software.{" "}
              <span className="text-brand">Delivering Real Impact.</span>
            </motion.h1>

            <motion.p
              custom={0.2}
              variants={fadeUp}
              className="text-description mt-4 text-sm sm:mt-5 sm:text-base lg:mt-3 lg:max-w-[20rem] desktop:mt-5 desktop:max-w-2xl desktop:text-base 2xl:max-w-none"
            >
              We deliver quality assurance, test automation, CAD customization
              and software tooling solutions that drive performance, reliability
              and business growth.
            </motion.p>

            <motion.div
              custom={0.28}
              variants={fadeUp}
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4 lg:mt-5 lg:justify-start desktop:mt-8"
            >
              <CTAButton href={ROUTES.services} variant="primary">
                Explore Our Services
              </CTAButton>
              <CTAButton href={ROUTES.about} variant="secondary">
                About Us
              </CTAButton>
            </motion.div>

            {/* <TrustedLogos className="lg:text-left [&_ul]:justify-center lg:[&_ul]:justify-start" /> */}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
