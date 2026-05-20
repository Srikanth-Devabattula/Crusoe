import { API_BASE_URL } from "@/constants";

function getUploadsBaseUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, "");
}

/** Public URL for a resume stored on the API server */
export function getResumeUrl(filename: string): string {
  return `${getUploadsBaseUrl()}/uploads/resumes/${encodeURIComponent(filename)}`;
}

/** Resolve blog cover — external URL or file uploaded to the API server */
export function getBlogCoverUrl(coverImage?: string): string | null {
  if (!coverImage?.trim()) return null;

  if (/^https?:\/\//i.test(coverImage)) {
    return coverImage;
  }

  const filename = coverImage.replace(/^\/+/, "").split("/").pop() ?? coverImage;
  return `${getUploadsBaseUrl()}/uploads/blog-covers/${encodeURIComponent(filename)}`;
}
