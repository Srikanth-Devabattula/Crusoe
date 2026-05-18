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
        "hero-card-inner group relative aspect-[4/3] h-full min-h-[400px] w-full overflow-hidden rounded-[28px] shadow-hero-card transition-transform duration-500 ease-out sm:aspect-[16/11] sm:min-h-[440px] sm:rounded-[32px] lg:aspect-[16/10] lg:min-h-[480px] xl:min-h-[520px]",
        isActive && "shadow-[0_28px_90px_rgba(108,191,42,0.15)]",
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

      <motion.div
        className="relative z-10 flex h-full min-h-[inherit] w-full"
        initial={false}
        animate={isActive ? { opacity: 1 } : { opacity: 0.94 }}
      >
        <motion.div
          className="flex max-w-[62%] flex-1 flex-col justify-center p-6 sm:max-w-[56%] sm:p-8 lg:max-w-[50%] lg:p-9 xl:p-10"
          initial={{ opacity: 0, x: -12 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.9, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex w-fit items-center rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold text-brand shadow-sm backdrop-blur-sm sm:text-xs lg:text-[11px]">
            {slide.number} / {String(total).padStart(2, "0")}
          </span>

          <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 p-2 shadow-sm backdrop-blur-sm sm:h-14 sm:w-14">
            <Image
              src={slide.icon}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </div>

          <h3 className="mt-4 text-lg font-bold tracking-tight text-gray-900 sm:text-xl lg:text-[1.35rem]">
            {slide.title}
          </h3>

          <span className="mt-3 block h-1 w-12 rounded-full bg-brand" aria-hidden />

          <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:text-[13px] lg:max-w-md lg:text-xs">
            {slide.description}
          </p>

          <motion.div
            className="mt-6 sm:mt-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-semibold text-white shadow-hero-cta transition-colors hover:bg-brand-dark sm:px-6 sm:text-[13px] lg:text-xs"
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
