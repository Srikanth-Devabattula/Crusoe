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

export function TestimonialsSection() {
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
      className="section-padding bg-gray-50"
    >
      <div className="hero-container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">
              TESTIMONIALS
            </p>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
          </div>

          <div className="flex gap-2">
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
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${
                currentIndex * (100 / slidesPerView)
              }%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-4">
                    <FaQuoteLeft className="w-8 h-8 text-brand" />

                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map(
                        (_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className="w-4 h-4 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed flex-grow mb-6 text-sm">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>

                      <p className="text-sm text-gray-600">
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
        <div className="mt-8 flex items-center justify-center gap-3">
          {Array.from({ length: maxIndex + 1 }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "h-4 w-4 bg-lime-500 shadow-md shadow-lime-300"
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