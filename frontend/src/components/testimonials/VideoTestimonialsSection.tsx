"use client";

import { Play } from "lucide-react";

const videoPlaceholders = [
  {
    id: 1,
    name: "Michael Johnson",
    title: "Engineering Director",
    company: "Ansys",
    gradient: "from-slate-800 via-slate-700 to-slate-900",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "VP Product",
    company: "Dassault Systèmes",
    gradient: "from-emerald-900 via-slate-800 to-slate-900",
  },
  {
    id: 3,
    name: "Robert Taylor",
    title: "CTO",
    company: "Siemens",
    gradient: "from-slate-900 via-slate-800 to-emerald-950",
  },
];

export function VideoTestimonialsSection() {
  return (
    <section
      aria-label="Video testimonials"
      className="section-padding bg-transparent"
    >
      <div className="hero-container">
        <p className="mb-8 text-[18px] font-semibold uppercase tracking-wider text-brand sm:mb-10">
          VIDEO TESTIMONIALS
        </p>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {videoPlaceholders.map((video) => (
            <article
              key={video.id}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <div
                className={`relative aspect-[4/5] w-full bg-gradient-to-br sm:aspect-[3/4] ${video.gradient}`}
              >
                <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />

                <button
                  type="button"
                  aria-label={`Play video testimonial from ${video.name}`}
                  className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand shadow-lg transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16"
                  onClick={() => {}}
                >
                  <Play className="ml-1 h-6 w-6 fill-brand sm:h-7 sm:w-7" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-12 sm:p-5 sm:pt-14">
                  <p className="text-sm font-semibold text-white sm:text-base">
                    {video.name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/85 sm:text-sm">
                    {video.title}, {video.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Video testimonials coming soon.
        </p>
      </div>
    </section>
  );
}
