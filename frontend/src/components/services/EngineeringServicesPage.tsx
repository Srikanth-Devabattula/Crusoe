"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Cog, Sparkles } from "lucide-react";

import { DottedPattern, FloatingOrb } from "@/components/about/AboutDecor";
import { ROUTES } from "@/constants";
import {
  ENGINEERING_IMAGES,
  engineeringContentSections,
  engineeringCtaBanner,
  engineeringIntroLabels,
  engineeringMigrationSection,
  engineeringServiceCards,
} from "@/data/engineeringServicesPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

import { RelatedServicesSection } from "./RelatedServicesSection";
import {
  ServiceBreadcrumbHero,
  defaultServiceCrumbs,
} from "./ServiceBreadcrumbHero";

export function EngineeringServicesPage() {
  const introPair = engineeringContentSections;

  return (
    <>
      <ServiceBreadcrumbHero
        title="Engineering Services"
        crumbs={[...defaultServiceCrumbs, { label: "Engineering Services" }]}
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
                src={ENGINEERING_IMAGES.hero}
                alt="Engineering Services"
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
                Engineering & Design
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                Platform migration, Onshape CAD design, conceptual models and
                product configurators — delivered with decades of engineering
                expertise.
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
            {introPair.map((section, index) => (
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
                    {engineeringIntroLabels[index]}
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

          {/* Engineering highlight */}
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
                  <Cog
                    className="size-8 text-brand sm:size-9"
                    strokeWidth={1.75}
                  />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                  {engineeringCtaBanner.badge}
                </span>
                <h3 className="text-heading mt-4 text-lg font-bold leading-snug sm:text-xl lg:text-[22px]">
                  {engineeringCtaBanner.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.75] text-slate-600 sm:text-[15px]">
                  {engineeringCtaBanner.description}
                </p>

                <ul className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                  {engineeringCtaBanner.highlights.map((item) => (
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

          {/* Migration detail — image + content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.08}
            className="relative mt-8 overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#ffffff_0%,#f6fbf2_55%,#eef8e7_100%)] p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:mt-10 sm:p-8 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />

            <div className="relative grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
                <div className="relative aspect-[16/10] w-full sm:aspect-[3/2] lg:aspect-auto lg:min-h-[320px] lg:h-full xl:min-h-[360px]">
                  <Image
                    src={ENGINEERING_IMAGES.migration}
                    alt="Strategic platform migration and engineering workflow"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                  Migration Process
                </span>
                <h3 className="text-heading mt-4 text-2xl font-bold sm:text-[28px]">
                  {engineeringMigrationSection.heading}
                </h3>
                <div className="mt-4 space-y-4 text-left text-sm leading-[1.75] text-slate-600 sm:text-[15px]">
                  {engineeringMigrationSection.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Engineering services grid */}
      <section
        aria-label="Engineering service offerings"
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
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
              What we deliver
            </p>
            <h2 className="text-heading mt-3 text-[22px] sm:text-[26px] lg:text-[28px]">
              Our Engineering Services
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.08}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {engineeringServiceCards.map((card) => (
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

      <RelatedServicesSection currentHref={ROUTES.servicesEngineering} />
    </>
  );
}
