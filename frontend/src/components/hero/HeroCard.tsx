"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import type { HeroSlide } from "@/data/heroSlides";
import { HERO_SLIDES } from "@/data/heroSlides";
import { cn } from "@/lib/cn";

interface HeroCardProps {
  slide: HeroSlide;
  isActive?: boolean;
  className?: string;
}

export function HeroCard({ slide, isActive = false, className }: HeroCardProps) {
  const total = HERO_SLIDES.length;

  return (
    <motion.article
      className={cn(
        "hero-card-inner group relative aspect-[4/3] h-full min-h-[360px] w-full overflow-hidden rounded-[24px] shadow-hero-card transition-transform duration-500 ease-out sm:min-h-[380px] sm:rounded-[28px] lg:aspect-auto lg:min-h-[420px] lg:rounded-[26px] desktop:aspect-[16/10] desktop:min-h-[440px] desktop:rounded-[32px] 2xl:min-h-[520px]",
        isActive && "shadow-[0_28px_90px_rgba(126, 168, 73,0.15)]",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={isActive ? { scale: 1.03 } : { scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src={slide.background}
          alt=""
          fill
          priority={slide.id === 1}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* #F3F5F9 panel — solid to 35%, then fade for readable copy over images */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(90deg,#F3F5F9_0%,#F3F5F9_35%,rgba(243,245,249,0.92)_43%,rgba(243,245,249,0.55)_51%,transparent_63%)]"
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex h-full min-h-[inherit] w-full"
        initial={false}
        animate={isActive ? { opacity: 1 } : { opacity: 0.94 }}
      >
        <motion.div
          className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-7 lg:py-6 lg:px-7 desktop:p-9 2xl:p-10"
          initial={{ opacity: 0, x: -12 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.9, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex w-fit items-center rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold text-brand shadow-sm backdrop-blur-sm sm:text-xs lg:text-[11px]">
            {slide.number} / {String(total).padStart(2, "0")}
          </span>

          <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 p-2 shadow-sm backdrop-blur-sm sm:mt-5 sm:h-12 sm:w-12 sm:rounded-2xl desktop:h-14 desktop:w-14">
            <Image
              src={slide.icon}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </div>

          <h3 className="text-heading mt-3 text-lg sm:mt-4 sm:text-xl lg:text-base desktop:mt-4 desktop:text-2xl">
            {slide.title}
          </h3>

          <span className="mt-3 block h-1 w-12 rounded-full bg-brand" aria-hidden />

          <p className="text-description !text-gray-800 mt-3 w-full max-w-[35%] text-xs leading-relaxed sm:mt-4 sm:text-sm lg:mt-3 lg:text-[13px] desktop:mt-4 desktop:text-base">
            {slide.description}
          </p>

          <motion.div
            className="mt-4 sm:mt-6 desktop:mt-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[11px] font-semibold text-white shadow-hero-cta transition-colors hover:bg-brand-dark sm:px-5 sm:py-3 sm:text-xs desktop:px-6 desktop:text-[13px]"
            >
              Learn More
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
