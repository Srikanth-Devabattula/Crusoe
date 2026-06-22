"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

import { cn } from "@/lib/cn";

interface MediaGallerySliderProps {
  images: string[];
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: "default" | "cover";
}

export function MediaGallerySlider({
  images,
  alt,
  className,
  priority = false,
  variant = "cover",
}: MediaGallerySliderProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const count = images.length;

  const goPrev = useCallback(() => {
    setIndex((current) => (current === 0 ? count - 1 : current - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((current) => (current === count - 1 ? 0 : current + 1));
  }, [count]);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  const markLoaded = useCallback((imageIndex: number) => {
    setLoaded((prev) => (prev[imageIndex] ? prev : { ...prev, [imageIndex]: true }));
  }, []);

  if (count === 0) return null;

  const showControls = count > 1;
  const isCover = variant === "cover";
  const allLoaded = images.every((_, i) => loaded[i]);

  return (
    <>
      <figure
        className={cn(
          "relative w-full overflow-hidden bg-white",
          isCover
            ? "shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
            : "mx-auto max-w-3xl rounded-[20px] border border-[#E8EEF5] shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
          className
        )}
      >
        <button
          type="button"
          onClick={openLightbox}
          aria-label="View full image"
          className={cn(
            "group relative block w-full cursor-zoom-in bg-white text-left",
            isCover
              ? "min-h-[280px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[520px] xl:min-h-[580px]"
              : "aspect-[16/10]"
          )}
        >
          {!allLoaded && (
            <div className="absolute inset-0 animate-pulse bg-white" aria-hidden />
          )}

          {images.map((src, imageIndex) => (
            <Image
              key={`${src}-${imageIndex}`}
              src={src}
              alt={
                count > 1
                  ? `${alt} — image ${imageIndex + 1} of ${count}`
                  : alt
              }
              fill
              unoptimized
              priority={priority && imageIndex === 0}
              sizes={isCover ? "100vw" : "(max-width: 768px) 100vw, 768px"}
              onLoad={() => markLoaded(imageIndex)}
              className={cn(
                "bg-white object-contain transition-opacity duration-300",
                imageIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            />
          ))}

          <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            Click to enlarge
          </span>
        </button>

        {showControls && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              className={cn(
                "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white",
                isCover ? "left-4 h-12 w-12 sm:left-6" : "left-3 h-10 w-10"
              )}
            >
              <FiChevronLeft className={isCover ? "h-6 w-6" : "h-5 w-5"} aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              className={cn(
                "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white",
                isCover ? "right-4 h-12 w-12 sm:right-6" : "right-3 h-10 w-10"
              )}
            >
              <FiChevronRight className={isCover ? "h-6 w-6" : "h-5 w-5"} aria-hidden />
            </button>
          </>
        )}

        {showControls && (
          <figcaption
            className={cn(
              "flex items-center justify-center gap-2 bg-white/95 px-4 py-3 backdrop-blur-sm",
              !isCover && "border-t border-[#E8EEF5]"
            )}
          >
            {images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Go to image ${dotIndex + 1}`}
                aria-current={dotIndex === index ? "true" : undefined}
                onClick={() => setIndex(dotIndex)}
                className={cn(
                  "h-2 rounded-full transition",
                  dotIndex === index ? "w-6 bg-brand" : "w-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </figcaption>
        )}
      </figure>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Full size image viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close full image"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <FiX className="h-6 w-6" />
          </button>

          {showControls && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <FiChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <FiChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[90vh] max-w-[95vw] items-center justify-center rounded-lg bg-white p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={
                count > 1
                  ? `${alt} — image ${index + 1} of ${count}`
                  : alt
              }
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>

          {showControls && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {index + 1} / {count}
            </p>
          )}
        </div>
      )}
    </>
  );
}
