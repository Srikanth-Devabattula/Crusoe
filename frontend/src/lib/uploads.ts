import { API_BASE_URL } from "@/constants";

/**
 * Base URL for uploaded files (resumes, blog/news covers).
 * In the browser we use same-origin `/uploads/...` paths proxied by Next.js
 * to the API server — keeps images working in local dev after hot reloads.
 */
export function getUploadsBaseUrl(): string {
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

  if (typeof window !== "undefined") {
    return "";
  }

  return apiOrigin;
}

function uploadsPath(folder: string, filename: string): string {
  const base = getUploadsBaseUrl();
  const path = `/uploads/${folder}/${encodeURIComponent(filename)}`;
  return base ? `${base}${path}` : path;
}

/** Public URL for a resume stored on the API server */
export function getResumeUrl(filename: string): string {
  return uploadsPath("resumes", filename);
}

/** Resolve blog cover — external URL or file uploaded to the API server */
export function getBlogCoverUrl(coverImage?: string): string | null {
  if (!coverImage?.trim()) return null;

  if (/^https?:\/\//i.test(coverImage)) {
    return coverImage;
  }

  const filename = coverImage.replace(/^\/+/, "").split("/").pop() ?? coverImage;
  return uploadsPath("blog-covers", filename);
}

export function getNewsCoverUrl(coverImage?: string): string | null {
  if (!coverImage?.trim()) return null;

  if (/^https?:\/\//i.test(coverImage)) {
    return coverImage;
  }

  const filename = coverImage.replace(/^\/+/, "").split("/").pop() ?? coverImage;
  return uploadsPath("news-covers", filename);
}
