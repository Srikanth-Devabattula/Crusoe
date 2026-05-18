"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { HERO_SLIDES } from "@/data/heroSlides";
import { HeroCard } from "@/components/hero/HeroCard";
import { HeroPagination } from "@/components/hero/HeroPagination";
import { HeroSliderNav } from "@/components/hero/HeroSliderNav";

import "swiper/css";
import "swiper/css/effect-fade";

export function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index);
  }, []);

  const goPrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const goNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

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
          loop
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          className="hero-swiper !overflow-visible w-full rounded-[28px] sm:rounded-[32px]"
        >
          {HERO_SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <HeroCard slide={slide} isActive={activeIndex === index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <HeroPagination
        total={HERO_SLIDES.length}
        activeIndex={activeIndex}
        onSelect={goTo}
        className="mt-6 sm:mt-8"
      />
    </motion.div>
  );
}
