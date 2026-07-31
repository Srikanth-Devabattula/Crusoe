"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

import { getTestimonialPhotoUrl } from "@/lib/uploads";
import { testimonialService } from "@/services";
import type { Testimonial } from "@/types";

const FALLBACK_PHOTO = "/images/testimonials/default.jpeg";

type TestimonialsSectionProps = {
  variant?: "home" | "page";
};

export function TestimonialsSection({ variant = "home" }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await testimonialService.getPublished("text");
        if (!cancelled) {
          setTestimonials(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        if (!cancelled) setTestimonials([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(4);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxIndex = Math.max(testimonials.length - slidesPerView, 0);
  const canSlide = testimonials.length > slidesPerView;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const nextTestimonial = useCallback(() => {
    if (!canSlide || isTransitioning || currentIndex >= maxIndex) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [canSlide, isTransitioning, currentIndex, maxIndex]);

  const prevTestimonial = useCallback(() => {
    if (!canSlide || isTransitioning || currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [canSlide, isTransitioning, currentIndex]);

  useEffect(() => {
    if (isPaused || !canSlide) return;
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, isTransitioning, maxIndex, canSlide]);

  if (isLoading) {
    return (
      <section className="section-padding bg-transparent">
        <div className="hero-container animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-100" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-gray-50 lg:h-[420px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const renderCard = (testimonial: Testimonial) => {
    const photoSrc = getTestimonialPhotoUrl(testimonial.photo) ?? FALLBACK_PHOTO;
    const rating = testimonial.rating ?? 5;

    return (
      <div className="flex h-full w-full min-h-[280px] sm:min-h-[300px] lg:min-h-[320px] desktop:min-h-[340px] flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7 lg:p-6 desktop:p-8">
        <div className="mb-4 flex items-center justify-between sm:mb-5">
          <FaQuoteLeft className="h-6 w-6 text-brand sm:h-7 sm:w-7 lg:h-6 lg:w-6 desktop:h-8 desktop:w-8" />
          <div className="flex gap-0.5 sm:gap-1">
            {[...Array(rating)].map((_, starIndex) => (
              <FaStar
                key={starIndex}
                className="h-3 w-3 text-yellow-400 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 desktop:h-4 desktop:w-4"
              />
            ))}
          </div>
        </div>
        <p className="mb-4 line-clamp-[7] overflow-hidden text-xs leading-relaxed text-gray-700 sm:line-clamp-[8] sm:text-sm lg:line-clamp-[11] lg:text-[11px] lg:leading-[1.55] desktop:line-clamp-[10] desktop:text-sm desktop:leading-relaxed">
          {testimonial.quote}
        </p>
        <div className="mt-auto flex items-center gap-2.5 sm:gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-11 sm:w-11 lg:h-9 lg:w-9 desktop:h-12 desktop:w-12">
            <img
              src={photoSrc}
              alt={testimonial.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900 lg:text-xs desktop:text-sm">
              {testimonial.name}
            </h4>
            <p className="line-clamp-2 text-xs text-gray-600 lg:text-[10px] lg:leading-snug desktop:text-sm">
              {testimonial.title}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="testimonials" aria-label="Testimonials" className="section-padding bg-transparent">
      <div className="hero-container">
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand sm:text-base lg:text-xs desktop:text-base">
              TESTIMONIALS
            </p>
            {variant === "home" && (
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-[26px] desktop:text-4xl">
                What Our Clients Say
              </h2>
            )}
          </div>
          {canSlide && (
            <div className="flex shrink-0 gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  setIsPaused(true);
                  prevTestimonial();
                  setTimeout(() => setIsPaused(false), 8000);
                }}
                disabled={currentIndex === 0}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  currentIndex === 0
                    ? "cursor-not-allowed border-gray-200 text-gray-300"
                    : "border-gray-300 hover:border-brand hover:bg-brand hover:text-white"
                }`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsPaused(true);
                  nextTestimonial();
                  setTimeout(() => setIsPaused(false), 8000);
                }}
                disabled={currentIndex >= maxIndex}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  currentIndex >= maxIndex
                    ? "cursor-not-allowed border-gray-200 text-gray-300"
                    : "border-gray-300 hover:border-brand hover:bg-brand hover:text-white"
                }`}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {canSlide ? (
          <div className="overflow-hidden">
            <div
              className="flex items-stretch transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="flex w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/4"
                >
                  {renderCard(testimonial)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="flex w-full">
                {renderCard(testimonial)}
              </div>
            ))}
          </div>
        )}

        {canSlide && maxIndex > 0 && (
          <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-4 w-4 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-brand shadow-md shadow-lime-300"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
