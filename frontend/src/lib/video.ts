export type VideoEmbedType = "youtube" | "vimeo" | "direct";

export interface VideoEmbedInfo {
  type: VideoEmbedType;
  embedUrl: string;
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function getVimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

/** Parse a video URL into embed info for YouTube, Vimeo, or direct MP4/WebM */
export function getVideoEmbedInfo(url?: string): VideoEmbedInfo | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  const youtubeId = getYouTubeId(trimmed);
  if (youtubeId) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    };
  }

  const vimeoId = getVimeoId(trimmed);
  if (vimeoId) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    };
  }

  if (/^https?:\/\/.+\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: "direct", embedUrl: trimmed };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return { type: "direct", embedUrl: trimmed };
  }

  return null;
}

/** All video URLs for a blog/news post (supports legacy single videoUrl) */
export function getPostVideoUrls(post: {
  videoUrls?: string[];
  videoUrl?: string;
}): string[] {
  if (post.videoUrls?.length) {
    return post.videoUrls.map((url) => url.trim()).filter(Boolean);
  }
  if (post.videoUrl?.trim()) return [post.videoUrl.trim()];
  return [];
}
