"use client";

import { MediaGallerySlider } from "@/components/common/MediaGallerySlider";
import { VideoEmbed } from "@/components/common/VideoEmbed";

interface PostGalleryProps {
  images: string[];
  title: string;
}

export function PostGallery({ images, title }: PostGalleryProps) {
  if (images.length === 0) return null;

  return (
    <MediaGallerySlider
      images={images}
      alt={title}
      priority
      variant="cover"
    />
  );
}

interface PostVideoProps {
  title: string;
  videoUrls?: string[];
}

export function PostVideo({ title, videoUrls = [] }: PostVideoProps) {
  const urls = videoUrls.filter(Boolean);
  if (urls.length === 0) return null;

  return (
    <section className="pb-12 lg:pb-16">
      <div className="hero-container min-w-0">
        <div className="mx-auto flex max-w-xl flex-col gap-5">
          {urls.map((url, index) => (
            <VideoEmbed
              key={`${url}-${index}`}
              videoUrl={url}
              title={urls.length > 1 ? `${title} — video ${index + 1}` : `${title} video`}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
