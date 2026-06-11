"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  SOFTWARE_QUALITY_PLACEHOLDER_IMAGE,
  softwareQualityAdvantageItems,
  softwareQualityAdvantageTagline,
  softwareQualityContentSections,
  softwareQualityCtaBanner,
  softwareQualityTestingCards,
} from "@/data/softwareQualityPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

import { ServiceAdvantageSection } from "./ServiceAdvantageSection";
import {
  ServiceBreadcrumbHero,
  defaultServiceCrumbs,
} from "./ServiceBreadcrumbHero";
import { ServicesCtaSection } from "./ServicesCtaSection";

export function SoftwareQualityServicePage() {
  return (
    <>
      <ServiceBreadcrumbHero
        title="Software Quality"
        crumbs={[...defaultServiceCrumbs, { label: "Software Quality" }]}
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
                src={SOFTWARE_QUALITY_PLACEHOLDER_IMAGE}
                alt="Software Quality"
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
            className="mx-auto mt-10 max-w-5xl space-y-8 text-justify text-sm leading-relaxed text-slate-700 sm:text-base"
          >
            {softwareQualityContentSections.slice(0, 2).map((section) => (
              <div key={section.heading} className="space-y-4">
                <h2 className="text-heading text-left text-xl font-bold sm:text-2xl">
                  {section.heading}
                </h2>
                {"emphasis" in section && section.emphasis && (
                  <p>
                    <strong>{section.emphasis}</strong>
                  </p>
                )}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.08}
            className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[24px] border border-[#6B913A]/30 bg-[linear-gradient(135deg,#6B913A_0%,#7EA849_45%,#5a7f32_100%)] px-6 py-10 text-center shadow-[0_16px_50px_rgba(107,145,58,0.25)] sm:px-10"
          >
            <p className="text-base font-semibold leading-relaxed text-white sm:text-lg lg:text-xl">
              {softwareQualityCtaBanner}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.1}
            className="mx-auto mt-10 max-w-5xl space-y-8 text-justify text-sm leading-relaxed text-slate-700 sm:text-base"
          >
            {softwareQualityContentSections.slice(2).map((section) => (
              <div key={section.heading} className="space-y-4">
                <h2 className="text-heading text-left text-xl font-bold sm:text-2xl">
                  {section.heading}
                </h2>
                {"emphasis" in section && section.emphasis && (
                  <p>
                    <strong>
                      {"emphasisItalic" in section && section.emphasisItalic ? (
                        <em>{section.emphasis}</em>
                      ) : (
                        section.emphasis
                      )}
                    </strong>
                  </p>
                )}
                {"showImages" in section && section.showImages && (
                  <div className="grid gap-4 py-2 sm:grid-cols-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e7efe0]">
                      <Image
                        src={SOFTWARE_QUALITY_PLACEHOLDER_IMAGE}
                        alt="Server infrastructure"
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e7efe0]">
                      <Image
                        src={SOFTWARE_QUALITY_PLACEHOLDER_IMAGE}
                        alt="Server infrastructure"
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <ServiceAdvantageSection
        tagline={softwareQualityAdvantageTagline}
        items={softwareQualityAdvantageItems}
      />

      <section
        aria-label="Software testing services"
        className="section-padding relative overflow-hidden bg-transparent pt-0"
      >
        <div className="hero-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-heading text-[22px] sm:text-[26px] lg:text-[28px]">
              Software Testing Services
            </h2>
            <p className="text-description mt-3 text-sm sm:text-base">
              <strong>
                <em>A Versatile SQA Eco-system</em>
              </strong>
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.08}
            className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {softwareQualityTestingCards.map((card) => (
              <div
                key={card.title}
                className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf2_100%)] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-heading text-sm font-bold uppercase tracking-wide sm:text-base">
                    {card.title}
                  </h3>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {card.number}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  {card.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <ServicesCtaSection />
    </>
  );
}
