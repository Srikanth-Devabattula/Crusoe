"use client";

import { motion } from "framer-motion";

export function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      aria-hidden
      animate={{ y: [0, -14, 0], opacity: [0.5, 0.95, 0.5] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function DottedPattern({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#7EA849_1px,transparent_1px)] [background-size:20px_20px] ${className ?? ""}`}
      aria-hidden
    />
  );
}
