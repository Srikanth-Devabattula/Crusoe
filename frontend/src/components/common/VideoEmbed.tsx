"use client";

import { getVideoEmbedInfo } from "@/lib/video";
import { cn } from "@/lib/cn";

interface VideoEmbedProps {
  videoUrl?: string;
  title?: string;
  className?: string;
  fullWidth?: boolean;
  compact?: boolean;
}

export function VideoEmbed({
  videoUrl,
  title = "Video",
  className,
  fullWidth = false,
  compact = false,
}: VideoEmbedProps) {
  const info = getVideoEmbedInfo(videoUrl);
  if (!info) return null;

  const frameClass = cn(
    "overflow-hidden bg-black shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
    compact
      ? "mx-auto w-full max-w-xl rounded-xl border border-[#E8EEF5]"
      : fullWidth
        ? "w-full rounded-[20px] border border-[#E8EEF5]"
        : "mx-auto max-w-3xl rounded-[20px] border border-[#E8EEF5] shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
    className
  );

  if (info.type === "direct") {
    return (
      <figure className={frameClass}>
        <video
          src={info.embedUrl}
          controls
          playsInline
          className={cn("w-full", compact ? "aspect-video max-h-[280px]" : "aspect-video")}
          title={title}
        />
      </figure>
    );
  }

  return (
    <figure className={frameClass}>
      <div
        className={cn(
          "relative w-full",
          compact ? "aspect-video max-h-[280px]" : "aspect-video"
        )}
      >
        <iframe
          src={info.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </figure>
  );
}
