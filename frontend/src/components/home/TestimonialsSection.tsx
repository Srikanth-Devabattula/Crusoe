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
  const [currentIndex, setCurrentIndex] = useState(testimonials.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const nextTestimonial = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const prevTestimonial = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const handleManualNext = useCallback(() => {
    setIsPaused(true);
    nextTestimonial();

    setTimeout(() => setIsPaused(false), 8000);
  }, [nextTestimonial]);

  const handleManualPrev = useCallback(() => {
    setIsPaused(true);
    prevTestimonial();
    setTimeout(() => setIsPaused(false), 8000);
  }, [prevTestimonial]);

  useEffect(() => {
    if (isTransitioning || isResetting) return;

    if (currentIndex >= testimonials.length * 2) {
      setIsResetting(true);
      const timer = setTimeout(() => {
        setCurrentIndex(testimonials.length);
        setIsResetting(false);
      }, 50);
      return () => clearTimeout(timer);
    } else if (currentIndex < testimonials.length) {
      setIsResetting(true);
      const timer = setTimeout(() => {
        setCurrentIndex(testimonials.length * 2 - 1);
        setIsResetting(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTransitioning, isResetting]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        nextTestimonial();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [nextTestimonial, isPaused, isTransitioning]);

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
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const infiniteTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

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
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleManualNext}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className={`flex testimonials-track ${!isResetting ? "transition-transform duration-300 ease-in-out" : ""}`}
            style={{
              transform: `translateX(-${(currentIndex * 100) / slidesPerView}%)`,
            }}
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-4">
                    <FaQuoteLeft className="w-8 h-8 text-brand" />

                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className="w-4 h-4 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed flex-grow mb-6 text-sm">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
      </div>
    </section>
  );
}
