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

  return (
    <motion.article
      className={cn(
        "hero-card-inner group flex h-[70vh] min-h-[460px] w-full flex-col overflow-hidden rounded-[24px] bg-[#F3F5F9] shadow-hero-card transition-transform duration-500 ease-out sm:rounded-[28px] lg:flex-row lg:rounded-[26px] desktop:rounded-[32px]",
        isActive && "shadow-[0_28px_90px_rgba(126, 168, 73,0.15)]",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <motion.div
        className="flex w-full shrink-0 flex-col items-start justify-center p-6 sm:p-8 lg:h-full lg:w-[42%] lg:shrink-0 lg:p-10 desktop:w-[40%] desktop:px-12 desktop:py-14"
        initial={{ opacity: 0, x: -12 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.94 }}
        transition={{ duration: 0.45 }}
      >
        <AnimatedBadge className="[&>div]:px-4 [&>div]:py-2.5 [&>div]:text-sm desktop:[&>div]:px-5 desktop:[&>div]:py-3 desktop:[&>div]:text-[15px]">
          Software Quality, Engineered to Perfection.
        </AnimatedBadge>

        <span className="mt-5 inline-flex w-fit items-center rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand shadow-sm sm:mt-6">
          {number} / {total}
        </span>

        <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-3 shadow-sm sm:mt-6 sm:h-16 sm:w-16">
          <Image
            src={slide.icon}
            alt=""
            width={56}
            height={56}
            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
          />
        </div>

        <h3 className="text-heading mt-4 text-[28px] leading-tight sm:mt-5 sm:text-[34px] lg:text-[38px] desktop:text-[42px] 2xl:text-[46px]">
          {slide.title}
        </h3>

        <span className="mt-4 block h-1.5 w-16 rounded-full bg-brand sm:mt-5" aria-hidden />

        <p className="text-description !text-gray-800 mt-4 max-w-lg text-base leading-relaxed sm:mt-5 sm:text-lg desktop:mt-6 desktop:text-xl desktop:leading-relaxed">
          {slide.description}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-4">
          <CTAButton
            href={ROUTES.services}
            variant="primary"
            className="w-full !px-6 !py-3.5 !text-sm sm:w-auto desktop:!px-8 desktop:!py-4 desktop:!text-base"
          >
            Explore Our Services
          </CTAButton>
          <CTAButton
            href={ROUTES.about}
            variant="secondary"
            className="w-full !px-6 !py-3.5 !text-sm sm:w-auto desktop:!px-8 desktop:!py-4 desktop:!text-base"
          >
            About Us
          </CTAButton>
        </div>
      </motion.div>

      <div className="relative flex min-h-[240px] w-full flex-1 items-stretch p-4 sm:p-5 lg:min-h-0 lg:p-6 lg:pl-3 desktop:p-8 desktop:pl-4">
        <motion.div
          className="relative h-full min-h-[220px] w-full overflow-hidden rounded-[20px] sm:rounded-[22px] lg:rounded-[24px] desktop:rounded-[28px]"
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
    </motion.article>
  );
}
