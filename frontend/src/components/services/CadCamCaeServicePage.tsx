"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import {
  CAD_CAM_PLACEHOLDER_IMAGE,
  cadCamAdvantageLinks,
  cadCamEnsuresItems,
  cadCamGamutTabs,
  cadCamIntroSections,
} from "@/data/cadCamCaePage";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

import { ServiceAdvantageSection } from "./ServiceAdvantageSection";
import {
  ServiceBreadcrumbHero,
  defaultServiceCrumbs,
} from "./ServiceBreadcrumbHero";
import { ServicesCtaSection } from "./ServicesCtaSection";

export function CadCamCaeServicePage() {
  const [activeTabId, setActiveTabId] = useState(
    cadCamGamutTabs[0]?.id ?? "new-projects"
  );

  const activeTab =
    cadCamGamutTabs.find((tab) => tab.id === activeTabId) ?? cadCamGamutTabs[0];

  return (
    <>
      <ServiceBreadcrumbHero
        title="CAD CAM CAE Software Testing"
        crumbs={[
          ...defaultServiceCrumbs,
          { label: "CAD CAM CAE Software Testing" },
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
                src={CAD_CAM_PLACEHOLDER_IMAGE}
                alt="CAD CAM CAE Software Testing"
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
            {cadCamIntroSections.map((section) => (
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
            custom={0.1}
            className="mt-12 grid items-center gap-8 rounded-[28px] border border-[#e7efe0] bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-8 lg:grid-cols-2 lg:gap-10"
          >
            <div className="overflow-hidden rounded-[20px] border border-[#e7efe0]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={CAD_CAM_PLACEHOLDER_IMAGE}
                  alt="Quality assurance process"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-heading text-xl font-bold sm:text-2xl">
                It ensures:
              </h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {cadCamEnsuresItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-[#f6fbf2] px-4 py-3 text-sm text-slate-700 sm:text-base"
                  >
                    <CheckCircle2 className="size-5 shrink-0 text-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <ServiceAdvantageSection links={cadCamAdvantageLinks} />

      <section
        aria-label="CAD PDM PLM quality assurance"
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
              Our gamut of services in
            </p>
            <h2 className="text-heading mt-3 text-[22px] sm:text-[26px] lg:text-[28px]">
              CAD / PDM / PLM quality assurance includes:
            </h2>
          </motion.div>

          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {cadCamGamutTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:px-5 sm:text-[15px]",
                  activeTabId === tab.id
                    ? "border-brand bg-brand text-white shadow-[0_8px_24px_rgba(126,168,73,0.3)]"
                    : "border-[#e7efe0] bg-white text-slate-700 hover:border-brand/40 hover:text-brand"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 overflow-hidden rounded-[28px] border border-[#e7efe0] bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="grid lg:grid-cols-[minmax(0,0.95fr)_1fr]">
                <div className="relative min-h-[220px] lg:min-h-[320px]">
                  <Image
                    src={CAD_CAM_PLACEHOLDER_IMAGE}
                    alt={activeTab.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#081526]/20 to-transparent lg:hidden" />
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <h3 className="text-heading text-lg font-bold leading-snug sm:text-xl lg:text-2xl">
                    {activeTab.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {activeTab.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-700 sm:text-[15px]"
                      >
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <ServicesCtaSection />
    </>
  );
}
