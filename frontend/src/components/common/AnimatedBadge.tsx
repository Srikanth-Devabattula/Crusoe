"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBadge({ children, className }: AnimatedBadgeProps) {
  return (
    <div className={`relative inline-flex overflow-hidden rounded-full p-[2px] ${className ?? ""}`}>
      <motion.span
        className="absolute inset-[-120%] bg-[conic-gradient(from_0deg,transparent_0deg,#7EA849_70deg,transparent_140deg,transparent_220deg,#7EA849_290deg,transparent_360deg)]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden
      />
      <div className="relative inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 shadow-[0_1px_4px_rgba(15,23,42,0.08)] lg:text-[11px]">
        <Sparkles className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
        <span>{children}</span>
        <motion.span
          className="size-2 shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(126, 168, 73,0.55)]"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            times: [0, 0.49, 0.5, 1],
            ease: "linear",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
