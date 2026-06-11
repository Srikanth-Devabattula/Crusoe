"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    quote:
      "I was amazed how well Crusoe performed in creating parametric CAD model of a midsize drone without prior involvement in the design process. We were afraid that without understanding of design nuances and being located on a different continent, Crusoe would require a lot of guidance and many hours on Teams. However, Crusoe's expertise in Onshape made the task execution very smooth. Well done, thank you.",
    name: "Adam Groszek",
    title: "Aerospace Engineer & Engineering Manager",
    image: "/images/testimonials/default.jpeg",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Crusoe Technologies has proven to be an outstanding and trusted partner whose deep technical knowledge and industry expertise have been instrumental in not only advancing Onshape's software capabilities but also in empowering our customers to deliver exceptional products.",
    name: "David Katzman",
    title: "General Manager - Velocity Group, PTC Inc",
    image: "/images/testimonials/david-katzman.png",
    rating: 5,
  },
  {
    id: 3,
    quote:
      'Crusoe has been a great partner for Onshape through the years. Their industry knowledge, attention to detail, diligence and dedication to making a great product helps us deliver an unprecedented CAD experience where often customers say "It just works". Crusoe is and will continue to be a trusted voice in our development and release process.',
    name: "Jake Ramsley",
    title: "Senior Director - QA & Release Manager, PTC Inc",
    image: "/images/testimonials/jake-ramsley.png",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "Working with Crusoe has been an exceptional experience for Juniper, particularly in developing configurable assemblies in Onshape. Their team's expertise, professionalism, and commitment to quality have exceeded our expectations. We highly recommend Crusoe for their exemplary service and dedication to delivering outstanding results.",
    name: "Penko Slivov",
    title: "Lead Senior Engineer, Juniper",
    image: "/images/testimonials/default.jpeg",
    rating: 5,
  },
];

type TestimonialsSectionProps = {
  /** On dedicated page, hero already has the main heading */
  variant?: "home" | "page";
};

export function TestimonialsSection({ variant = "home" }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();

    window.addEventListener("resize", updateSlidesPerView);

    return () =>
      window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxIndex = Math.max(
    testimonials.length - slidesPerView,
    0
  );

  const nextTestimonial = useCallback(() => {
    if (isTransitioning) return;

    if (currentIndex >= maxIndex) return;

    setIsTransitioning(true);

    setCurrentIndex((prev) => prev + 1);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentIndex, maxIndex]);

  const prevTestimonial = useCallback(() => {
    if (isTransitioning) return;

    if (currentIndex <= 0) return;

    setIsTransitioning(true);

    setCurrentIndex((prev) => prev - 1);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentIndex]);

  const handleManualNext = useCallback(() => {
    setIsPaused(true);

    nextTestimonial();

    setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  }, [nextTestimonial]);

  const handleManualPrev = useCallback(() => {
    setIsPaused(true);

    prevTestimonial();

    setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  }, [prevTestimonial]);

  // Auto Slide
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prev) => {
          if (prev >= maxIndex) {
            return 0;
          }

          return prev + 1;
        });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, isTransitioning, maxIndex]);

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="section-padding bg-transparent"
    >
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

          <div className="flex shrink-0 gap-2 self-start sm:self-auto">
            <button
              onClick={handleManualPrev}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                currentIndex === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:bg-brand hover:text-white hover:border-brand"
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleManualNext}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                currentIndex >= maxIndex
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:bg-brand hover:text-white hover:border-brand"
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex items-stretch transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${
                currentIndex * (100 / slidesPerView)
              }%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3"
              >
                <div className="flex h-[340px] w-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:h-[360px] sm:p-5 lg:h-[380px] lg:p-4 lg:pb-5 desktop:h-[400px] desktop:p-6">
                  <div className="mb-3 flex items-center justify-between sm:mb-4">
                    <FaQuoteLeft className="h-6 w-6 text-brand sm:h-7 sm:w-7 lg:h-6 lg:w-6 desktop:h-8 desktop:w-8" />

                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(testimonial.rating)].map(
                        (_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className="h-3 w-3 text-yellow-400 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 desktop:h-4 desktop:w-4"
                          />
                        )
                      )}
                    </div>
                  </div>

                  <p className="mb-3 flex-grow overflow-hidden text-xs leading-relaxed text-gray-700 line-clamp-[7] sm:text-sm sm:line-clamp-[8] lg:text-[11px] lg:leading-[1.55] lg:line-clamp-[9] desktop:text-sm desktop:leading-relaxed desktop:line-clamp-[8]">
                    {testimonial.quote}
                  </p>

                  <div className="mt-auto flex items-center gap-2.5 sm:gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-11 sm:w-11 lg:h-9 lg:w-9 desktop:h-12 desktop:w-12">
                      <img
                        src={testimonial.image}
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
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
          {Array.from({ length: maxIndex + 1 }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "h-4 w-4 bg-brand shadow-md shadow-lime-300"
                    : "h-4 w-4 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}