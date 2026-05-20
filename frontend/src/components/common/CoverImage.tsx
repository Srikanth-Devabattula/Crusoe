"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

interface CoverImageProps {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  fallback?: React.ReactNode;
}

/** Image with graceful fallback when upload URL is missing or unreachable */
export function CoverImage({
  src,
  alt = "",
  className,
  imageClassName,
  fill,
  width,
  height,
  priority,
  sizes,
  fallback,
}: CoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    if (!fallback) return null;
    return (
      <div className={cn(fill && "absolute inset-0", className)}>{fallback}</div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      unoptimized
      onError={() => setHasError(true)}
      className={cn(fill && "object-cover object-center", imageClassName, className)}
    />
  );
}
