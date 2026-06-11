"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  ENGINEERING_PLACEHOLDER_IMAGE,
  engineeringFeatureBlocks,
  engineeringRelatedLinks,
} from "@/data/engineeringServicesPage";
import { ROUTES } from "@/constants";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

import { ServiceAdvantageSection } from "./ServiceAdvantageSection";
import { ServiceBreadcrumbHero } from "./ServiceBreadcrumbHero";
import { ServicesCtaSection } from "./ServicesCtaSection";

export function EngineeringServicesPage() {
  return (
    <>
      <ServiceBreadcrumbHero
        title="Engineering Services"
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Services", href: ROUTES.services },
          { label: "Engineering Services" },
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
                src={ENGINEERING_PLACEHOLDER_IMAGE}
                alt="Engineering Services"
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
            custom={0.04}
            className="mt-10"
          >
            <h2 className="text-heading text-[22px] font-bold sm:text-[26px] lg:text-[28px]">
              Engineering Services
            </h2>
          </motion.div>

          <div className="mt-10 space-y-14 lg:space-y-16">
            {engineeringFeatureBlocks.map((block, index) => {
              const imageFirst = block.imagePosition === "left";

              return (
                <motion.div
                  key={block.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeUp}
                  custom={index * 0.06}
                  className="space-y-6"
                >
                  <div
                    className={cn(
                      "grid items-center gap-8 rounded-[28px] border border-[#e7efe0] bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-8 lg:grid-cols-2 lg:gap-10",
                      !imageFirst && "lg:[&>div:first-child]:order-2"
                    )}
                  >
                    <div className="overflow-hidden rounded-[20px] border border-[#e7efe0]">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={ENGINEERING_PLACEHOLDER_IMAGE}
                          alt={block.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="text-justify">
                      <h3 className="text-heading text-xl font-bold sm:text-2xl">
                        {block.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                        {block.description}
                      </p>
                    </div>
                  </div>

                  {block.extraParagraphs && (
                    <div className="mx-auto max-w-5xl space-y-4 text-justify text-sm leading-relaxed text-slate-700 sm:text-base">
                      {block.extraParagraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceAdvantageSection
        eyebrow="Explore more"
        heading="Related Services"
        links={engineeringRelatedLinks}
      />

      <ServicesCtaSection />
    </>
  );
}
