"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { ROUTES } from "@/constants";
import { homeServicesCardImages, servicesList } from "@/data/servicesPage";

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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function OurServicesSection() {
  return (
    <section
      id="our-services"
      aria-label="Our services"
      className="relative overflow-hidden bg-transparent py-10 sm:py-12 lg:py-14"
    >
      {/* dotted background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="hero-container relative z-10">
        {/* top content */}
        <div className="grid gap-10 lg:grid-cols-1 lg:gap-8 desktop:grid-cols-[1fr_minmax(0,360px)] desktop:items-start desktop:gap-12 xl:grid-cols-[1fr_420px] xl:gap-16">
          {/* left heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-base font-bold uppercase tracking-[0.12em] text-brand sm:text-lg lg:text-sm desktop:text-lg xl:text-xl">
              Our Services
            </p>

            <h2 className="text-heading mt-4 max-w-[720px] text-[32px] leading-[1.08] sm:text-[44px] lg:text-[28px] lg:leading-[1.12] desktop:text-[34px] xl:text-[46px] 2xl:text-[50px]">
              Solutions That Drive
              <br />
              <span className="text-brand">Quality and Innovation</span>
            </h2>
          </motion.div>

          {/* right text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.08}
            className="lg:max-w-none desktop:pt-2 xl:pt-4"
          >
            <p className="max-w-[420px] text-[15px] leading-[1.75] text-[#4b5563] lg:max-w-none desktop:text-[16px] xl:text-[17px] xl:leading-[2]">
              We combine deep domain expertise with modern engineering
              practices to deliver high-quality solutions tailored to your
              business needs.
            </p>

            <Link
              href={ROUTES.services}
              className="group mt-7 inline-flex items-center gap-3 text-[17px] font-semibold text-brand transition-all duration-300 hover:gap-4"
            >
              View All Services

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-8 grid items-stretch gap-4 sm:mt-9 sm:gap-5 md:grid-cols-2 md:gap-6 lg:mt-10 lg:grid-cols-4 lg:gap-4 desktop:gap-6 xl:gap-6"
        >
          {servicesList.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index * 0.08}
              variants={fadeUp}
              whileHover={{
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
              className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[20px] border border-[#edf2e7] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-brand/20 hover:shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:min-h-[380px] sm:rounded-[24px] lg:min-h-[360px] lg:rounded-[18px] desktop:min-h-0 desktop:rounded-[26px] xl:rounded-[30px]"
            >
              {/* glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126, 168, 73,0.05),transparent_68%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* image */}
              <div className="relative h-[240px] shrink-0 overflow-hidden sm:h-[220px] lg:h-[175px] desktop:h-[250px] xl:h-[260px]">
                <Image
                  src={homeServicesCardImages[service.id] ?? service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1376px) 25vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* content */}
              <div className="relative z-10 flex flex-1 flex-col p-3 sm:p-4 lg:p-3 desktop:p-4 xl:p-5">
                <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-xl lg:text-[14px] lg:leading-tight desktop:text-[20px] xl:text-[26px]">
                  {service.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4b5563] sm:mt-3 sm:text-[15px] lg:mt-2 lg:text-[11px] lg:leading-[1.5] desktop:mt-3 desktop:text-[14px] desktop:leading-[1.65] xl:mt-4 xl:text-[16px] xl:leading-[1.95]">
                  {service.description}
                </p>

                {/* button */}
                <Link
                  href={service.href}
                  className="group/link mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand sm:mt-5 sm:gap-3 sm:text-[15px] lg:mt-3 lg:gap-1.5 lg:text-[11px] desktop:mt-5 desktop:text-[14px] xl:mt-7 xl:text-[16px]"
                >
                  Learn More

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 sm:h-5 sm:w-5 lg:h-3.5 lg:w-3.5 desktop:h-4 desktop:w-4 xl:h-5 xl:w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}