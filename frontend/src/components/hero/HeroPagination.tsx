"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

interface HeroPaginationProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function HeroPagination({
  total,
  activeIndex,
  onSelect,
  className,
}: HeroPaginationProps) {
  return (
    <motion.div
      className={cn("flex items-center justify-center gap-2.5", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={activeIndex === index ? "true" : undefined}
          onClick={() => onSelect(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            activeIndex === index
              ? "w-8 bg-brand shadow-[0_0_12px_rgba(126, 168, 73,0.5)]"
              : "w-2 bg-gray-300 hover:bg-gray-400"
          )}
        />
      ))}
    </motion.div>
  );
}
