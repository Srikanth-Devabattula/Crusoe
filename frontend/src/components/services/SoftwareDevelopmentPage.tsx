"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  SOFTWARE_DEVELOPMENT_PLACEHOLDER_IMAGE,
  softwareDevelopmentBenefits,
  softwareDevelopmentCapabilities,
  softwareDevelopmentIntro,
} from "@/data/softwareDevelopmentPage";
import { ROUTES } from "@/constants";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

import { ServiceAdvantageSection } from "./ServiceAdvantageSection";
import { ServiceBreadcrumbHero } from "./ServiceBreadcrumbHero";
import { ServicesCtaSection } from "./ServicesCtaSection";

export function SoftwareDevelopmentPage() {
  return (
    <>
      <ServiceBreadcrumbHero
        title="Software Development"
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Services", href: ROUTES.services },
          { label: "Software Development" },
        ]}
      />

      <section className="section-padding relative overflow-hidden bg-transparent pt-0">
        <div className="hero-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0}
            className="overflow-hidden rounded-[28px] border border-[#e7efe0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
          >
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image
                src={SOFTWARE_DEVELOPMENT_PLACEHOLDER_IMAGE}
                alt="Software Development"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.06}
            className="mx-auto mt-10 max-w-5xl space-y-5 text-justify text-sm leading-relaxed text-slate-700 sm:text-base"
          >
            <p>{softwareDevelopmentIntro.lead}</p>
            <p>
              <strong>{softwareDevelopmentIntro.emphasis}</strong>
            </p>
            {softwareDevelopmentIntro.taglines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <h2 className="text-heading pt-2 text-left text-xl font-bold sm:text-2xl">
              {softwareDevelopmentIntro.heading}
            </h2>
            {softwareDevelopmentIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.1}
            className="mt-12 grid gap-5 sm:grid-cols-2"
          >
            {softwareDevelopmentCapabilities.map((capability) => (
              <div
                key={capability.id}
                className={cn(
                  "rounded-[24px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f3f7fc_100%)] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-7",
                  capability.fullWidth && "sm:col-span-2"
                )}
              >
                <h3 className="text-heading text-lg font-bold text-[#4A7DDB] sm:text-xl">
                  {capability.title} :
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  {capability.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <ServiceAdvantageSection
        eyebrow="Why partner with us"
        heading="Benefits to you"
        richItems={softwareDevelopmentBenefits}
      />

      <ServicesCtaSection />
    </>
  );
}
