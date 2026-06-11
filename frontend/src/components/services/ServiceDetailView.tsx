"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { CTAButton } from "@/components/hero/CTAButton";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";
import { ROUTES } from "@/constants";
import type { ServicePageData } from "@/data/servicePages";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

import { ServicesCtaSection } from "./ServicesCtaSection";

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

interface ServiceDetailViewProps {
  page: ServicePageData;
}

export function ServiceDetailView({ page }: ServiceDetailViewProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-transparent">
        <PageHeroOverlay />

        <motion.div
          className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.div custom={0.05} variants={fadeUpItem}>
              <AnimatedBadge>{page.badge}</AnimatedBadge>
            </motion.div>

            <motion.h1
              className="text-heading mt-4 text-[28px] leading-[1.12] sm:text-[34px] lg:mt-5 lg:text-[38px] xl:text-[42px]"
              custom={0.08}
              variants={fadeUpItem}
            >
              {page.headline}{" "}
              <span className="text-brand">{page.highlight}</span>
            </motion.h1>

            <motion.p
              className="text-description mx-auto mt-3 max-w-2xl text-sm sm:text-base lg:mt-4"
              custom={0.12}
              variants={fadeUpItem}
            >
              {page.description}
            </motion.p>

            <motion.div
              custom={0.16}
              variants={fadeUpItem}
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <CTAButton href={ROUTES.contact} variant="primary">
                Talk to Experts
              </CTAButton>
              <CTAButton href={ROUTES.services} variant="secondary">
                All Services
              </CTAButton>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section
        aria-label={`${page.title} capabilities`}
        className="section-padding relative overflow-hidden bg-transparent"
      >
        <div className="hero-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="rounded-[28px] border border-[#e7efe0] bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-8"
            >
              <h2 className="text-heading text-[22px] sm:text-[26px]">
                What We Cover
              </h2>
              <ul className="mt-5 space-y-4">
                {page.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-700 sm:text-base"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={0.08}
              className="rounded-[28px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf2_50%,#eef8e7_100%)] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-8"
            >
              <h2 className="text-heading text-[22px] sm:text-[26px]">
                How We Help
              </h2>
              <ul className="mt-5 space-y-4">
                {page.offerings.map((offering) => (
                  <li
                    key={offering}
                    className="flex items-start gap-3 text-sm text-slate-700 sm:text-base"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
                    <span>{offering}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ServicesCtaSection />
    </>
  );
}
