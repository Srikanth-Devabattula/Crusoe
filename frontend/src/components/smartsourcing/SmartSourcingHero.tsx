"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail } from "react-icons/fi";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";
import { ROUTES } from "@/constants";
import { DottedPattern, FloatingOrb } from "@/components/about/AboutDecor";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function SmartSourcingHero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <PageHeroOverlay>
        <DottedPattern />
      </PageHeroOverlay>

      <motion.div
        className="hero-container relative z-10 pb-10 pt-[5.25rem] sm:pb-12 sm:pt-[5.75rem] lg:pb-14 lg:pt-[6.25rem] xl:pb-16"
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-8 xl:gap-12">
          <motion.div
            className="order-2 w-full min-w-0 text-center lg:order-1 lg:max-w-xl lg:text-left xl:max-w-2xl"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>SMARTSOURCING</AnimatedBadge>
            </motion.div>

            <h1 className="text-heading mt-4 text-[28px] leading-[1.12] sm:text-[34px] lg:mt-5 lg:text-[36px] xl:text-[42px]">
              Beyond Outsourcing:
              <br />
              <span className="text-brand">Elevating Innovation</span>
            </h1>

            <p className="text-description mx-auto mt-4 max-w-lg text-sm leading-relaxed sm:text-base lg:mx-0 lg:mt-5">
              In today’s competitive landscape, many companies find themselves bogged down by operational complexities rather than focusing on what truly matters: Innovation. While traditional outsourcing has long been the go-to for cost-cutting, a more sophisticated approach is emerging.
              <br className="hidden md:inline" />
              <br className="hidden md:inline" />
              At Crusoe Technologies, we specialize in SmartSourcing—a simple yet powerful model designed to function synergistically as an extended arm of your business.
            </p>

            <motion.div
              custom={0.12}
              variants={fadeUp}
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <Link
                href="#what-is-smartsourcing"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-hero-cta transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_14px_36px_rgba(126,168,73,0.35)] sm:w-auto"
              >
                Learn More
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={ROUTES.contact}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-brand shadow-sm transition-all duration-300 hover:border-brand/30 hover:bg-brand-muted/40 sm:w-auto"
              >
                <FiMail className="h-4 w-4" />
                Contact Us
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 w-full min-w-0 lg:order-2"
            custom={0.14}
            variants={fadeUp}
          >
            <div className="relative mx-auto w-full lg:mx-0">
              <div className="relative overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#f6fbf2_0%,#ffffff_100%)] p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-4 lg:p-5">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand/15 blur-3xl"
                  aria-hidden
                />
                <FloatingOrb
                  className="absolute left-6 top-8 z-10 h-3 w-3 rounded-full bg-brand/60"
                  delay={0.3}
                />

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:aspect-[2/1]">
                  <Image
                    src="/images/stock/smartsourcing.png"
                    alt="Crusoe Technologies SmartSourcing Model"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
