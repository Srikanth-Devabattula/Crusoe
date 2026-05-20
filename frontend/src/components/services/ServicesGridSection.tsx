"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { servicesList } from "@/data/servicesPage";
import { HERO_BG_IMAGE } from "@/data/heroSlides";
import { staggerContainer } from "@/lib/motion";

import { ServiceCard } from "./ServiceCard";

export function ServicesGridSection() {
  return (
    <section
      aria-label="Our services"
      className="section-padding relative overflow-hidden bg-[#f4f7f2]"
    >
      {/* Background — matches reference / testimonials feel */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={HERO_BG_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#f4f7f2]/90 to-[#eef4e8]" />
        <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-brand/15 blur-[100px]" />
        <div className="absolute -left-16 top-1/3 h-[280px] w-[280px] rounded-full bg-white/60 blur-[80px]" />
      </div>

      <div className="hero-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:gap-7 lg:grid-cols-2 lg:gap-8 xl:gap-10"
        >
          {servicesList.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
