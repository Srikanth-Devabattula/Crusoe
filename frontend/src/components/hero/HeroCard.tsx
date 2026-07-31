"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { CTAButton } from "@/components/hero/CTAButton";
import { ROUTES } from "@/constants";
import type { HeroSlideView } from "@/data/heroSlides";
import { cn } from "@/lib/cn";

interface HeroCardProps {
  slide: HeroSlideView;
  slideIndex: number;
  totalSlides: number;
  isActive?: boolean;
  className?: string;
}

export function HeroCard({
  slide,
  slideIndex,
  totalSlides,
  isActive = false,
  className,
}: HeroCardProps) {
  const number = String(slideIndex + 1).padStart(2, "0");
  const total = String(totalSlides).padStart(2, "0");

  const ctaHref =
    slide.ctaLink && slide.ctaLink.trim()
      ? slide.ctaLink.trim()
      : slideIndex === 0
      ? ROUTES.servicesQuality
      : slideIndex === 1
      ? ROUTES.servicesEngineering
      : slideIndex === 2
      ? ROUTES.servicesDevelopment
      : slideIndex === 3
      ? ROUTES.smartsourcing
      : ROUTES.services;

  return (
    <motion.article
      className={cn(
        "hero-card-inner group flex w-full flex-col overflow-hidden rounded-[24px] bg-[#F3F5F9] shadow-hero-card transition-transform duration-500 ease-out max-lg:h-auto sm:rounded-[28px] lg:h-[70vh] lg:max-h-[640px] lg:min-h-0 lg:flex-row lg:rounded-[26px] desktop:rounded-[32px]",
        isActive && "shadow-[0_28px_90px_rgba(126, 168, 73,0.15)]",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="relative order-1 flex w-full shrink-0 items-stretch p-4 pb-3 sm:p-5 sm:pb-4 lg:order-2 lg:min-h-0 lg:flex-1 lg:p-5 lg:pl-2 lg:pb-5 desktop:p-8 desktop:pl-4">
        <motion.div
          className="relative mx-auto aspect-[4/3] w-full max-h-[42vh] min-h-[220px] overflow-hidden rounded-[20px] sm:max-h-[44vh] sm:min-h-[260px] sm:rounded-[22px] lg:mx-0 lg:aspect-auto lg:h-full lg:max-h-none lg:min-h-0 lg:rounded-[24px] desktop:rounded-[28px]"
          animate={isActive ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src={slide.background}
            alt=""
            fill
            priority={slideIndex === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </div>

      <motion.div
        className="hero-card-content relative z-10 order-2 flex w-full shrink-0 select-text flex-col items-start justify-center overflow-visible px-5 pb-6 pt-1 text-left sm:px-8 sm:pb-8 lg:order-1 lg:min-h-0 lg:w-[35%] lg:items-start lg:justify-start lg:p-6 lg:pb-5 lg:text-left lg:shrink-0 xl:p-8 desktop:w-[35%] desktop:px-12 desktop:py-12"
        initial={{ opacity: 0, x: -12 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.94 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center gap-3 w-full max-w-full justify-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl sm:p-3 desktop:h-16 desktop:w-16">
            <Image
              src={slide.icon}
              alt=""
              width={56}
              height={56}
              className="h-8 w-8 object-contain sm:h-10 sm:w-10 desktop:h-11 desktop:w-11"
            />
          </div>

          <div className="w-full max-w-full lg:max-w-[min(100%,420px)]">
            <AnimatedBadge className="w-full max-w-full [&>div]:w-full [&>div]:max-w-full [&>div]:items-start [&>div]:gap-x-2 [&>div]:gap-y-1 [&>div]:px-3 [&>div]:py-2 [&>div]:text-[11px] [&>div]:leading-snug sm:[&>div]:px-3.5 sm:[&>div]:text-xs xl:[&>div]:items-center xl:[&>div]:px-4 xl:[&>div]:py-2.5 xl:[&>div]:text-xs desktop:[&>div]:px-5 desktop:[&>div]:py-3 desktop:[&>div]:text-[15px] max-lg:[&>div]:justify-start max-lg:[&_.animated-badge-label]:text-left xl:[&_.animated-badge-label]:text-left">
              Software Quality, Engineered to Perfection.
            </AnimatedBadge>
          </div>
        </div>

        <div className="lg:my-auto flex flex-col items-start w-full">
          <h3 className="text-heading mt-4 w-full text-[26px] leading-tight sm:mt-5 sm:text-[32px] lg:mt-0 lg:text-[22px] xl:text-[28px] desktop:text-[42px] 2xl:text-[46px]">
            {slide.title}
          </h3>

          <span
            className="mt-2 block h-1 w-12 rounded-full bg-brand sm:mt-3 sm:h-1.5 sm:w-16 desktop:mt-5"
            aria-hidden
          />

          <p className="text-description !text-gray-800 mt-2 w-full max-w-lg select-text text-base leading-relaxed sm:mt-3 sm:text-lg lg:mt-2 lg:max-w-none lg:text-left lg:text-[13px] lg:leading-snug xl:mt-3 xl:text-base xl:leading-relaxed desktop:mt-5 desktop:text-xl desktop:leading-relaxed">
            {slide.description}
          </p>
        </div>

        <div className="mt-4 flex w-full max-w-md shrink-0 flex-col gap-2.5 sm:mt-5 sm:gap-3 lg:mt-0 lg:max-w-none lg:flex-row lg:flex-wrap lg:justify-start lg:gap-2 xl:gap-3 desktop:gap-4">
          <CTAButton
            href={ctaHref}
            variant="primary"
            className="w-full !px-5 !py-3 !text-sm lg:!px-4 lg:!py-2.5 lg:!text-xs xl:!px-5 xl:!py-3 xl:!text-sm lg:w-auto desktop:!px-8 desktop:!py-4 desktop:!text-base"
          >
            Explore Our Services
          </CTAButton>
          <CTAButton
            href={ROUTES.about}
            variant="secondary"
            className="w-full !px-5 !py-3 !text-sm lg:!px-4 lg:!py-2.5 lg:!text-xs xl:!px-5 xl:!py-3 xl:!text-sm lg:w-auto desktop:!px-8 desktop:!py-4 desktop:!text-base"
          >
            About Us
          </CTAButton>
        </div>
      </motion.div>
    </motion.article>
  );
}
