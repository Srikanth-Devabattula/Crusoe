import { API_BASE_URL } from "@/constants";

const GRIDFS_PREFIX = "gridfs:";

/**
 * Base URL for browser requests (empty = same origin via Next rewrites).
 * Server-side rendering uses the full API origin.
 */
export function getUploadsBaseUrl(): string {
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

  if (typeof window !== "undefined") {
    return "";
  }

  return apiOrigin;
}

function resolveStoredCover(
  coverImage: string,
  bucket: "blog-covers" | "news-covers" | "testimonial-photos" | "team-photos" | "partner-logos"
): string {
  if (coverImage.startsWith(GRIDFS_PREFIX)) {
    const fileId = coverImage.slice(GRIDFS_PREFIX.length);
    return `${getUploadsBaseUrl()}/api/files/${bucket}/${fileId}`;
  }

  const filename = coverImage.replace(/^\/+/, "").split("/").pop() ?? coverImage;
  return `${getUploadsBaseUrl()}/uploads/${bucket}/${encodeURIComponent(filename)}`;
}

/** Public URL for a resume stored on the API server */
export function getResumeUrl(filename: string): string {
  return `${getUploadsBaseUrl()}/uploads/resumes/${encodeURIComponent(filename)}`;
}

/** Blog cover — external URL, MongoDB GridFS, or legacy disk filename */
export function getBlogCoverUrl(coverImage?: string): string | null {
  if (!coverImage?.trim()) return null;

  if (/^https?:\/\//i.test(coverImage)) {
    return coverImage;
  }

  return resolveStoredCover(coverImage, "blog-covers");
}

export function getNewsCoverUrl(coverImage?: string): string | null {
  if (!coverImage?.trim()) return null;

  if (/^https?:\/\//i.test(coverImage)) {
    return coverImage;
  }

  return resolveStoredCover(coverImage, "news-covers");
}

/** Resolve all gallery image URLs for a blog post */
export function getBlogGalleryUrls(post: {
  images?: string[];
  coverImage?: string;
}): string[] {
  const refs = post.images?.length ? post.images : post.coverImage ? [post.coverImage] : [];
  return refs.map((ref) => getBlogCoverUrl(ref)).filter((url): url is string => Boolean(url));
}

/** Resolve all gallery image URLs for a news article */
export function getNewsGalleryUrls(post: {
  images?: string[];
  coverImage?: string;
}): string[] {
  const refs = post.images?.length ? post.images : post.coverImage ? [post.coverImage] : [];
  return refs.map((ref) => getNewsCoverUrl(ref)).filter((url): url is string => Boolean(url));
}

/** Primary thumbnail for cards — first gallery image or legacy cover */
export function getBlogPrimaryCoverUrl(post: {
  images?: string[];
  coverImage?: string;
}): string | null {
  return getBlogGalleryUrls(post)[0] ?? null;
}

export function getNewsPrimaryCoverUrl(post: {
  images?: string[];
  coverImage?: string;
}): string | null {
  return getNewsGalleryUrls(post)[0] ?? null;
}

function resolveMediaPhoto(
  photo: string,
  bucket: "testimonial-photos" | "team-photos" | "partner-logos"
): string | null {
  if (!photo?.trim()) return null;
  if (photo.startsWith("/")) return photo;
  if (/^https?:\/\//i.test(photo)) return photo;
  return resolveStoredCover(photo, bucket);
}

export function getTestimonialPhotoUrl(photo?: string): string | null {
  return resolveMediaPhoto(photo ?? "", "testimonial-photos");
}

export function getTeamPhotoUrl(photo?: string): string | null {
  return resolveMediaPhoto(photo ?? "", "team-photos");
}

export function getPartnerLogoUrl(logo?: string): string | null {
  return resolveMediaPhoto(logo ?? "", "partner-logos");
}
