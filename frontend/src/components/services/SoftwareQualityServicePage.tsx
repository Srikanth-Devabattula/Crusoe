"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { DottedPattern, FloatingOrb } from "@/components/about/AboutDecor";
import { ROUTES } from "@/constants";
import {
  SOFTWARE_QUALITY_IMAGES,
  softwareQualityAdvantageItems,
  softwareQualityAdvantageTagline,
  softwareQualityContentSections,
  softwareQualityCtaBanner,
  softwareQualityIntroLabels,
  softwareQualityTestingCards,
} from "@/data/softwareQualityPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

import { RelatedServicesSection } from "./RelatedServicesSection";
import { ServiceAdvantageSection } from "./ServiceAdvantageSection";
import {
  ServiceBreadcrumbHero,
  defaultServiceCrumbs,
} from "./ServiceBreadcrumbHero";

export function SoftwareQualityServicePage() {
  const introPairOne = softwareQualityContentSections.slice(0, 2);
  const smartSourcingSection = softwareQualityContentSections[2];
  const specsSection = softwareQualityContentSections[3];

  return (
    <>
      <ServiceBreadcrumbHero
        title="Software Quality"
        crumbs={[...defaultServiceCrumbs, { label: "Software Quality" }]}
      />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-transparent pb-4 pt-0 sm:pb-6">
        <div className="hero-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0}
            className="group relative overflow-hidden rounded-[32px] border border-[#e7efe0] shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="relative aspect-[16/10] w-full sm:aspect-[21/9] lg:aspect-[2.4/1]">
              <Image
                src={SOFTWARE_QUALITY_IMAGES.hero}
                alt="Software Quality"
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/75 via-[#0f172a]/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/50 via-transparent to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:text-sm">
                <Sparkles className="size-3.5 text-brand-light" />
                Software Quality Assurance
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                Robust, secure and scalable products through consultative QA,
                SmartSourcing collaboration and end-to-end testing expertise.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro content */}
      <section className="section-padding relative overflow-hidden bg-transparent pt-6 sm:pt-8">
        <DottedPattern className="opacity-[0.04]" />
        <FloatingOrb
          className="absolute right-[8%] top-[12%] h-4 w-4 rounded-full bg-brand/40"
          delay={0.3}
        />

        <div className="hero-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8"
          >
            {introPairOne.map((section, index) => (
              <motion.article
                key={section.heading}
                variants={fadeUp}
                custom={index * 0.06}
                className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e7efe0] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-8"
              >
                <div
                  className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand via-brand-light to-brand/30"
                  aria-hidden
                />

                <div className="flex flex-1 flex-col">
                  <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                    {softwareQualityIntroLabels[index]}
                  </span>

                  <h2 className="text-heading mt-4 text-left text-lg font-bold leading-snug sm:text-xl lg:text-[20px] xl:text-[22px]">
                    {section.heading}
                  </h2>

                  {"emphasis" in section && section.emphasis && (
                    <p className="mt-3 text-left text-sm font-semibold leading-relaxed text-brand sm:text-[15px]">
                      {section.emphasis}
                    </p>
                  )}

                  <div className="mt-3 flex flex-1 flex-col space-y-4 text-left text-sm leading-[1.75] text-slate-600 sm:mt-4 sm:text-[15px]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Quality highlight */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.07}
            className="relative mt-8 overflow-hidden rounded-[28px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf2_55%,#eef8e7_100%)] shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:mt-10"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 left-1/4 h-36 w-36 rounded-full bg-brand/5 blur-3xl" />

            <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-8 lg:p-10">
              <div className="flex justify-center lg:justify-start">
                <div className="flex size-16 items-center justify-center rounded-[22px] bg-brand/10 ring-1 ring-brand/15 sm:size-[72px]">
                  <ShieldCheck className="size-8 text-brand sm:size-9" strokeWidth={1.75} />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                  {softwareQualityCtaBanner.badge}
                </span>
                <h3 className="text-heading mt-4 text-lg font-bold leading-snug sm:text-xl lg:text-[22px]">
                  {softwareQualityCtaBanner.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.75] text-slate-600 sm:text-[15px]">
                  {softwareQualityCtaBanner.description}
                </p>

                <ul className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                  {softwareQualityCtaBanner.highlights.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:text-[13px]"
                    >
                      <CheckCircle2 className="size-3.5 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* SmartSourcing — content + image (right) */}
          {smartSourcingSection && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0.08}
              className="relative mt-8 overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#ffffff_0%,#f6fbf2_55%,#eef8e7_100%)] p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:mt-10 sm:p-8 lg:p-10"
            >
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />

              <div className="relative grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="flex flex-col justify-center">
                  <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                    {softwareQualityIntroLabels[2]}
                  </span>
                  <h3 className="text-heading mt-4 text-2xl font-bold sm:text-[28px]">
                    {smartSourcingSection.heading}
                  </h3>
                  {"emphasis" in smartSourcingSection &&
                    smartSourcingSection.emphasis && (
                      <p className="mt-3 text-left text-sm font-semibold italic leading-relaxed text-brand sm:text-[15px]">
                        {smartSourcingSection.emphasis}
                      </p>
                    )}
                  <div className="mt-4 space-y-4 text-left text-sm leading-[1.75] text-slate-600 sm:text-[15px]">
                    {smartSourcingSection.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
                  <div className="relative aspect-[4/3] w-full sm:aspect-[3/2] lg:aspect-auto lg:min-h-[320px] lg:h-full xl:min-h-[360px]">
                    <Image
                      src={SOFTWARE_QUALITY_IMAGES.smartSourcing}
                      alt="SmartSourcing collaboration model — client and Crusoe locations with domain expertise"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-4 sm:p-6"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SPECS — image + content */}
          {specsSection && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0.09}
              className="relative mt-8 overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#ffffff_0%,#f6fbf2_55%,#eef8e7_100%)] p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:mt-10 sm:p-8 lg:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />

              <div className="relative grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
                  <div className="relative aspect-[21/9] w-full sm:aspect-[2.2/1] lg:aspect-auto lg:min-h-[280px] lg:h-full xl:min-h-[320px]">
                    <Image
                      src={SOFTWARE_QUALITY_IMAGES.specs}
                      alt="SPECS test plan, execution, bug reporting and release workflow"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-4 sm:p-6"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                    {softwareQualityIntroLabels[3]}
                  </span>
                  <h3 className="text-heading mt-4 text-2xl font-bold sm:text-[28px]">
                    {specsSection.heading}
                  </h3>
                  <div className="mt-4 space-y-4 text-left text-sm leading-[1.75] text-slate-600 sm:text-[15px]">
                    {specsSection.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <ServiceAdvantageSection
        tagline={softwareQualityAdvantageTagline}
        items={softwareQualityAdvantageItems}
      />

      {/* Testing services */}
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

      <RelatedServicesSection currentHref={ROUTES.servicesQuality} />
    </>
  );
}
