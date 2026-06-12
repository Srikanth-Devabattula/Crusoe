"use client";

import { motion } from "framer-motion";

import { servicesList } from "@/data/servicesPage";
import { staggerContainer } from "@/lib/motion";

import { ServiceCard } from "./ServiceCard";

export function ServicesGridSection() {
  return (
    <section
      aria-label="Our services"
      className="section-padding relative overflow-hidden bg-transparent"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-brand/15 blur-[100px]" />
        <div className="absolute -left-16 top-1/3 h-[280px] w-[280px] rounded-full bg-white/40 blur-[80px]" />
      </div>

      <div className="hero-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="grid w-full grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2 lg:gap-4 xl:gap-5 desktop:gap-5 2xl:gap-6"
        >
          {servicesList.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
