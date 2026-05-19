"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

type CTAButtonVariant = "primary" | "secondary";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: CTAButtonVariant;
  className?: string;
}

const variantStyles: Record<CTAButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-hero-cta hover:bg-brand-dark hover:shadow-[0_14px_36px_rgba(108,191,42,0.35)]",
  secondary:
    "border border-gray-200 bg-white text-brand shadow-sm hover:border-brand/30 hover:bg-brand-muted/40",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
}: CTAButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={cn(
          "group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-[13px] font-semibold transition-all duration-300 sm:px-7 sm:py-4 lg:text-xs",
          variantStyles[variant],
          className
        )}
      >
        {children}
        <ArrowRight
          className={cn(
            "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5",
            isPrimary ? "text-white" : "text-brand"
          )}
          strokeWidth={2.5}
        />
      </Link>
    </motion.div>
  );
}
