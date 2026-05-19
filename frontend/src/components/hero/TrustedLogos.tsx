"use client";

import { motion } from "framer-motion";

import { TRUSTED_COMPANIES } from "@/data/heroSlides";
import { cn } from "@/lib/cn";

interface TrustedLogosProps {
  className?: string;
}

export function TrustedLogos({ className }: TrustedLogosProps) {
  return (
    <motion.div
      className={cn("mt-10 sm:mt-12", className)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
    >
      <p className="text-[10px] font-medium tracking-wide text-gray-400 sm:text-xs lg:text-[11px]">
        Trusted by Innovative Companies Worldwide
      </p>
      <motion.ul
        className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.6 },
          },
        }}
      >
        {TRUSTED_COMPANIES.map((name) => (
          <motion.li
            key={name}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <motion.div
              className="flex h-9 min-w-[88px] items-center justify-center rounded-lg border border-gray-100 bg-gray-50/80 px-4 sm:h-10 sm:min-w-[100px]"
              title={name}
              aria-hidden
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[10px] lg:text-[9px]">
                {name}
              </span>
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
