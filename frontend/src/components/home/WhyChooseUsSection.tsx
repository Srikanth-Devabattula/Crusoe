"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  ShieldCheck,
  Users,
  Target,
  Layers3,
} from "lucide-react";

import { Globe } from "@/components/ui/globe";

const features = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Skilled engineers and QA specialists.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Focused",
    description: "Excellence in every client engagement.",
  },
  {
    icon: Layers3,
    title: "Agile Approach",
    description: "Flexible processes built around your needs.",
  },
  {
    icon: Clock3,
    title: "On-Time Delivery",
    description: "Committed to meeting deadlines.",
  },
  {
    icon: ShieldCheck,
    title: "Security First",
    description: "Robust security with strong data protection.",
  },
  {
    icon: Target,
    title: "Long-Term Partner",
    description: "We grow when you grow.",
  },
];

const fadeEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: fadeEase,
    },
  }),
};

export function WhyChooseUsSection() {
  return (
    <section
      id="why-choose-us"
      aria-label="Why choose us"
      className="relative overflow-hidden bg-transparent py-6 sm:py-8 lg:py-10"
    >
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="hero-container relative z-10">
        <div className="relative overflow-hidden rounded-[28px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbf4_45%,#eef8e7_100%)] shadow-[0_14px_40px_rgba(15,23,42,0.06)] desktop:rounded-[38px]">
          <div className="absolute -left-20 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-brand/[0.10] blur-3xl" />

          <div className="absolute inset-0 opacity-[0.04]">
            <div className="h-full w-full bg-[radial-gradient(#7EA849_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          <div className="relative grid min-w-0 gap-8 px-5 py-6 sm:gap-9 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(120px,0.42fr)_minmax(300px,1.1fr)] lg:items-center lg:gap-5 lg:px-6 lg:py-7 desktop:grid-cols-[minmax(0,1fr)_minmax(160px,0.55fr)_minmax(340px,1.2fr)] desktop:gap-6 desktop:px-8 desktop:py-8 xl:grid-cols-[minmax(0,1fr)_minmax(240px,0.75fr)_minmax(400px,1.35fr)] xl:gap-8 xl:px-9 xl:py-9 2xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)_minmax(440px,1.4fr)] 2xl:gap-10 2xl:px-10 2xl:py-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="min-w-0"
            >
              <p className="text-base font-bold uppercase tracking-[0.12em] text-brand sm:text-lg lg:text-sm desktop:text-lg xl:text-xl">
                Why Choose Us
              </p>

              <h2 className="text-heading mt-3 max-w-[520px] text-[26px] leading-[1.1] sm:mt-4 sm:text-[30px] lg:mt-3 lg:max-w-none lg:text-[28px] lg:leading-[1.12] xl:text-[34px] 2xl:text-[38px]">
                World&apos;s leading 
                <br />
                <span className="text-brand">Companies Trust Us</span>
              </h2>

              <div className="mt-4 h-[4px] w-16 rounded-full bg-brand lg:mt-4 desktop:mt-6 desktop:h-[5px] desktop:w-20" />

              <p className="text-description mt-5 max-w-[520px] leading-relaxed text-[#5b6472] sm:mt-6 sm:text-base lg:mt-5 lg:max-w-none lg:text-sm lg:leading-relaxed desktop:mt-6 desktop:text-[16px]">
                Since 2015 Crusoe has been helping world&apos;s leading
                companies to develop the latest Cloud based CAD, PDM and PLM
                products. Also helping leading Engineering companies to develop
                cutting edge products.
              </p>

              <div className="mt-6 rounded-[20px] border border-brand/20 bg-white/70 p-4 backdrop-blur sm:mt-7 sm:p-5 lg:mt-5 lg:rounded-[16px] lg:p-3.5 desktop:mt-7 desktop:rounded-[20px] desktop:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand sm:text-sm">
                  Mission
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6472] lg:text-xs lg:leading-relaxed desktop:mt-2.5 desktop:text-[15px] desktop:leading-relaxed">
                  Crusoe is a Software & Engineering Services Company helping to build some of the world's best engineering softwares in CAD, PDM and PLM areas. Also helping world's top engineering companies to build cutting edge and innovative products.
                </p>
              </div>

              <Link
                href="/about"
                className="group mt-7 inline-flex items-center gap-2.5 rounded-[18px] bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(126, 168, 73,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(126, 168, 73,0.38)] desktop:mt-10 desktop:gap-3 desktop:rounded-[20px] desktop:px-8 desktop:py-5 desktop:text-[17px]"
              >
                Know More About Us
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.08}
              className="relative flex min-h-[240px] min-w-0 items-center justify-center sm:min-h-[280px] lg:min-h-[200px] desktop:min-h-[260px] xl:min-h-[360px] 2xl:min-h-[440px]"
            >
              <div className="absolute h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle_at_center,rgba(126, 168, 73,0.16),transparent_68%)] sm:h-[320px] sm:w-[320px] lg:h-[220px] lg:w-[220px] desktop:h-[320px] desktop:w-[320px] xl:h-[480px] xl:w-[480px] 2xl:h-[520px] 2xl:w-[520px]" />
              <div className="absolute h-[280px] w-[280px] rounded-full border border-brand/10 sm:h-[320px] sm:w-[320px] lg:h-[220px] lg:w-[220px] desktop:h-[320px] desktop:w-[320px] xl:h-[480px] xl:w-[480px] 2xl:h-[520px] 2xl:w-[520px]" />
              <div className="absolute hidden h-[380px] w-[380px] rounded-full border border-brand/10 desktop:block xl:h-[440px] xl:w-[440px]" />
              <div className="absolute hidden h-[300px] w-[300px] rounded-full border border-brand/10 desktop:block xl:h-[360px] xl:w-[360px]" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 h-[240px] w-[240px] drop-shadow-[0_40px_70px_rgba(126,168,73,0.22)] sm:h-[280px] sm:w-[280px] lg:h-[200px] lg:w-[200px] desktop:h-[260px] desktop:w-[260px] xl:h-[360px] xl:w-[360px] 2xl:h-[440px] 2xl:w-[440px]"
              >
                <Globe className="size-full max-w-none" />
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.14}
              className="min-w-0 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:gap-2.5 desktop:gap-3.5 xl:gap-4 2xl:gap-5"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                    className="group w-full min-w-0 rounded-[16px] border border-white/60 bg-white/70 p-2.5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:rounded-[18px] sm:p-3 lg:rounded-[14px] lg:p-2 desktop:rounded-[18px] desktop:p-3 xl:rounded-[22px] xl:p-4 2xl:rounded-[24px] 2xl:p-5"
                  >
                    <div className="flex items-start gap-2 text-left sm:gap-2.5 lg:gap-1.5 desktop:gap-2.5 xl:gap-3 2xl:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f8fbf4] shadow-[0_6px_18px_rgba(15,23,42,0.05)] sm:h-11 sm:w-11 sm:rounded-[14px] desktop:h-12 desktop:w-12 xl:h-14 xl:w-14 xl:rounded-[16px] 2xl:h-16 2xl:w-16 2xl:rounded-[20px]">
                        <Icon
                          className="h-5 w-5 text-brand sm:h-[22px] sm:w-[22px] desktop:h-6 desktop:w-6 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7"
                          strokeWidth={2}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[13px] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[14px] lg:text-[11px] lg:leading-[1.2] desktop:text-[13px] xl:text-[15px] 2xl:text-[18px]">
                          {feature.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-[#6b7280] sm:mt-1.5 sm:text-[11px] lg:text-[9px] lg:leading-[1.35] desktop:text-[11px] xl:text-[12px] xl:leading-snug 2xl:mt-2 2xl:text-[14px] 2xl:leading-[1.45]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
