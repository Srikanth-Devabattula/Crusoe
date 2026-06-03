"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";

interface HeroSliderNavProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function HeroSliderNav({ onPrev, onNext, className }: HeroSliderNavProps) {
  return (
    <>
      <NavButton
        direction="prev"
        onClick={onPrev}
        className={cn("-left-2 sm:-left-4 lg:-left-5", className)}
        ariaLabel="Previous slide"
      />
      <NavButton
        direction="next"
        onClick={onNext}
        className={cn("-right-2 sm:-right-4 lg:-right-5", className)}
        ariaLabel="Next slide"
      />
    </>
  );
}

function NavButton({
  direction,
  onClick,
  className,
  ariaLabel,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
  ariaLabel: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-brand shadow-lg shadow-gray-200/60 backdrop-blur-sm transition-[transform,background-color,color,box-shadow] duration-200 hover:scale-105 hover:bg-white hover:text-brand-dark hover:shadow-xl active:scale-95 sm:h-10 sm:w-10 desktop:h-12 desktop:w-12",
        className
      )}
    >
      <Icon className="h-4 w-4 desktop:h-5 desktop:w-5" strokeWidth={2.5} />
    </button>
  );
}
