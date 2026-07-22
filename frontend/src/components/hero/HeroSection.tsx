"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroSlider } from "@/components/hero/HeroSlider";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent pb-14 pt-[7.5rem] sm:pb-16 sm:pt-[8.5rem] lg:pb-16 lg:pt-[8rem] desktop:pb-28 desktop:pt-[9.5rem]">
      <HeroBackground />

      <div className="hero-container relative z-10">
        <HeroSlider />
      </div>
    </section>
  );
}
