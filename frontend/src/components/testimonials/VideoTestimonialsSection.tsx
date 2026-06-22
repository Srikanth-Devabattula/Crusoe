"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";

import { VideoEmbed } from "@/components/common/VideoEmbed";
import { testimonialService } from "@/services";
import type { Testimonial } from "@/types";

const GRADIENTS = [
  "from-slate-800 via-slate-700 to-slate-900",
  "from-emerald-900 via-slate-800 to-slate-900",
  "from-slate-900 via-slate-800 to-emerald-950",
];

export function VideoTestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await testimonialService.getPublished("video");
        if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding bg-transparent">
        <div className="hero-container animate-pulse">
          <div className="h-6 w-56 rounded bg-gray-100" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-50" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section aria-label="Video testimonials" className="section-padding bg-transparent">
      <div className="hero-container">
        <p className="mb-8 text-[18px] font-semibold uppercase tracking-wider text-brand sm:mb-10">
          VIDEO TESTIMONIALS
        </p>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {items.map((video, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length];
            const hasVideo = Boolean(video.videoUrl?.trim());

            if (hasVideo) {
              return (
                <article key={video._id} className="overflow-hidden rounded-2xl shadow-md">
                  <VideoEmbed
                    videoUrl={video.videoUrl}
                    title={`${video.name} testimonial`}
                    compact
                  />
                  <div className="border border-t-0 border-[#E8EEF5] bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{video.name}</p>
                    <p className="mt-0.5 text-xs text-gray-600">
                      {video.title}
                      {video.company ? `, ${video.company}` : ""}
                    </p>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={video._id}
                className="group relative overflow-hidden rounded-2xl shadow-md"
              >
                <div
                  className={`relative aspect-[4/5] w-full bg-gradient-to-br sm:aspect-[3/4] ${gradient}`}
                >
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand shadow-lg sm:h-16 sm:w-16">
                    <Play className="ml-1 h-6 w-6 fill-brand sm:h-7 sm:w-7" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-12 sm:p-5 sm:pt-14">
                    <p className="text-sm font-semibold text-white sm:text-base">{video.name}</p>
                    <p className="mt-0.5 text-xs text-white/85 sm:text-sm">
                      {video.title}
                      {video.company ? `, ${video.company}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
