"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { HERO_SLIDES } from "@/data/heroSlides";
import { HeroCard } from "@/components/hero/HeroCard";
import { HeroPagination } from "@/components/hero/HeroPagination";
import { HeroSliderNav } from "@/components/hero/HeroSliderNav";
import { mapHeroSlides } from "@/lib/hero-slides";
import { heroSlideService } from "@/services";
import type { HeroSlideView } from "@/data/heroSlides";

import "swiper/css";
import "swiper/css/effect-fade";

export function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<HeroSlideView[]>(HERO_SLIDES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSlides = async () => {
      try {
        const res = await heroSlideService.getPublished();
        const items = Array.isArray(res.data) ? res.data : [];
        if (!cancelled && items.length > 0) {
          setSlides(mapHeroSlides(items));
        }
      } catch {
        if (!cancelled) {
          setSlides(HERO_SLIDES);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadSlides();

    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index);
  }, []);

  const goPrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const goNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  if (isLoading) {
    return (
      <div className="relative w-full min-w-0">
        <div className="min-h-[480px] animate-pulse rounded-[24px] bg-gray-200/70 max-lg:h-auto lg:h-[70vh] lg:min-h-[460px] sm:rounded-[28px] desktop:rounded-[32px]" />
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="relative w-full min-w-0"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.25 }}
    >
      <motion.div className="relative w-full">
        <HeroSliderNav onPrev={goPrev} onNext={goNext} />

        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          loop={slides.length > 1}
          simulateTouch={slides.length > 1}
          allowTouchMove={slides.length > 1}
          noSwipingClass="hero-card-content"
          touchStartPreventDefault={false}
          autoplay={
            slides.length > 1
              ? {
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          className="hero-swiper !overflow-visible w-full rounded-[24px] sm:rounded-[28px] desktop:rounded-[32px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <HeroCard
                slide={slide}
                slideIndex={index}
                totalSlides={slides.length}
                isActive={activeIndex === index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <HeroPagination
        total={slides.length}
        activeIndex={activeIndex}
        onSelect={goTo}
        className="mt-4 sm:mt-6 desktop:mt-8"
      />
    </motion.div>
  );
}
