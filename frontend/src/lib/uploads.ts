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
  bucket: "blog-covers" | "news-covers"
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
