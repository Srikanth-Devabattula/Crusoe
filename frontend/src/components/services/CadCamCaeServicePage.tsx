"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

import { DottedPattern, FloatingOrb } from "@/components/about/AboutDecor";
import { CAD_CAM_IMAGES, cadCamEnsuresItems, cadCamGamutTabs, cadCamIntroSections } from "@/data/cadCamCaePage";
import { ROUTES } from "@/constants";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

import { RelatedServicesSection } from "./RelatedServicesSection";
import {
  ServiceBreadcrumbHero,
  defaultServiceCrumbs,
} from "./ServiceBreadcrumbHero";

export function CadCamCaeServicePage() {
  const [activeTabId, setActiveTabId] = useState(
    cadCamGamutTabs[0]?.id ?? "new-projects"
  );

  const activeTab =
    cadCamGamutTabs.find((tab) => tab.id === activeTabId) ?? cadCamGamutTabs[0];
  const activeTabIndex = cadCamGamutTabs.findIndex(
    (tab) => tab.id === activeTabId
  );

  return (
    <>
      <ServiceBreadcrumbHero
        title="CAD CAM CAE Software Testing"
        crumbs={[
          ...defaultServiceCrumbs,
          { label: "CAD CAM CAE Software Testing" },
        ]}
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
                src={CAD_CAM_IMAGES.hero}
                alt="CAD CAM CAE Software Testing"
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
                Engineering Design QA
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                End-to-end quality assurance for CAD, CAM, CAE, PDM and PLM
                platforms — from new releases to mobile and custom testing.
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
            {cadCamIntroSections.map((section, index) => (
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
                    {index === 0 ? "Overview" : "Quality Engineering"}
                  </span>

                  <h2 className="text-heading mt-4 text-left text-lg font-bold leading-snug sm:text-xl lg:text-[20px] xl:text-[22px]">
                    {section.heading}
                  </h2>

                  <div className="mt-3 flex flex-1 flex-col space-y-4 text-justify text-sm leading-[1.75] text-slate-600 sm:mt-4 sm:text-[15px]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* It ensures */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.08}
            className="relative mt-12 overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#ffffff_0%,#f6fbf2_55%,#eef8e7_100%)] p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:mt-14 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />

            <div className="relative grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="overflow-hidden rounded-[24px] border border-white/80 shadow-[0_12px_36px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
                <div className="relative aspect-[16/10] w-full sm:aspect-[3/2] lg:aspect-auto lg:min-h-[320px] lg:h-full xl:min-h-[360px]">
                  <Image
                    src={CAD_CAM_IMAGES.ensures}
                    alt="Quality assurance process"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                  What you get
                </p>
                <h3 className="text-heading mt-2 text-2xl font-bold sm:text-[28px]">
                  It ensures:
                </h3>

                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={staggerContainer}
                  className="mt-6 flex flex-col gap-3"
                >
                  {cadCamEnsuresItems.map((item, index) => (
                    <motion.li
                      key={item}
                      variants={fadeUp}
                      custom={index * 0.04}
                      className="group flex items-center gap-3 rounded-2xl border border-[#e7efe0] bg-white/90 px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_8px_24px_rgba(126,168,73,0.12)]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                        <CheckCircle2 className="size-5" />
                      </span>
                      <span className="text-sm font-medium text-slate-700 sm:text-[15px]">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gamut tabs */}
      <section
        aria-label="CAD PDM PLM quality assurance"
        className="section-padding relative overflow-hidden bg-transparent pt-0"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 top-1/4 h-[300px] w-[300px] rounded-full bg-brand/8 blur-[90px]" />
        </div>

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
              Our gamut of services in
            </p>
            <h2 className="text-heading mt-3 text-[22px] sm:text-[26px] lg:text-[30px]">
              CAD / PDM / PLM quality assurance includes:
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={0.06}
            className="mt-10 overflow-hidden rounded-[32px] border border-[#e7efe0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.07)]"
          >
            {/* Top tabs — mobile scroll + lg centered row; sidebar from xl */}
            <div className="border-b border-[#e7efe0] bg-[#fafdf7] p-3 lg:p-4 xl:hidden">
              <div className="flex gap-2 overflow-x-auto lg:flex-wrap lg:justify-center lg:overflow-visible lg:gap-3">
                {cadCamGamutTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={cn(
                      "group shrink-0 transition-all duration-300",
                      "rounded-full px-4 py-2 text-sm font-semibold",
                      "lg:rounded-2xl lg:px-4 lg:py-3",
                      activeTabId === tab.id
                        ? "bg-brand text-white shadow-[0_6px_20px_rgba(126,168,73,0.3)] lg:bg-white lg:text-brand lg:shadow-[0_8px_24px_rgba(15,23,42,0.06)] lg:ring-1 lg:ring-[#e7efe0]"
                        : "bg-white text-slate-600 ring-1 ring-[#e7efe0] hover:text-brand lg:bg-transparent lg:ring-0 lg:hover:bg-white/70"
                    )}
                  >
                    <span className="flex items-center gap-2 lg:gap-3">
                      <span
                        className={cn(
                          "hidden lg:flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                          activeTabId === tab.id
                            ? "bg-brand text-white"
                            : "bg-white text-slate-500 ring-1 ring-[#e7efe0] group-hover:text-brand"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {tab.label}
                      {activeTabId === tab.id && (
                        <ArrowRight className="hidden size-4 shrink-0 lg:block" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid xl:grid-cols-[minmax(0,260px)_1fr] xl:items-stretch">
              {/* Desktop sidebar tabs — xl and up */}
              <div className="hidden h-[400px] flex-col gap-2 border-r border-[#e7efe0] bg-[#fafdf7] p-4 xl:flex 2xl:h-[420px]">
                {cadCamGamutTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={cn(
                      "group relative flex flex-1 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300",
                      activeTabId === tab.id
                        ? "bg-white text-brand shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-[#e7efe0]"
                        : "text-slate-600 hover:bg-white/70 hover:text-brand"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                          activeTabId === tab.id
                            ? "bg-brand text-white"
                            : "bg-white text-slate-500 ring-1 ring-[#e7efe0] group-hover:text-brand"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {tab.label}
                    </span>
                    {activeTabId === tab.id && (
                      <ArrowRight className="size-4 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab && (
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="grid h-auto min-h-[380px] lg:min-h-[400px] lg:grid-cols-2 xl:h-[400px] 2xl:h-[420px]"
                  >
                    <div className="relative min-h-[220px] lg:min-h-[260px] xl:min-h-0 xl:h-full">
                      <Image
                        src={activeTab.image}
                        alt={activeTab.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 via-transparent to-transparent xl:bg-gradient-to-r xl:from-transparent xl:via-transparent xl:to-white/10" />
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm xl:hidden">
                        {String(activeTabIndex + 1).padStart(2, "0")} /{" "}
                        {String(cadCamGamutTabs.length).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
                      <p className="hidden text-xs font-bold uppercase tracking-[0.12em] text-brand xl:block">
                        {activeTab.label}
                      </p>
                      <h3 className="text-heading mt-1 line-clamp-3 text-base font-bold leading-snug sm:text-lg xl:mt-2 xl:text-xl">
                        {activeTab.title}
                      </h3>

                      <ul className="mt-4 flex flex-col gap-2 sm:mt-5">
                        {activeTab.items.map((item, index) => (
                          <li
                            key={item}
                            className="flex min-h-[44px] items-center gap-2.5 rounded-xl bg-[#f6fbf2]/80 px-3 py-2 text-sm text-slate-700 sm:gap-3 sm:px-3.5 sm:text-[14px]"
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                              {index + 1}
                            </span>
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* <RelatedServicesSection currentHref={ROUTES.servicesCadCam} /> */}
    </>
  );
}
