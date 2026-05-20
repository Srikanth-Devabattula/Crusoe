import { API_BASE_URL } from "@/constants";

/** Public URL for a resume stored on the API server */
export function getResumeUrl(filename: string): string {
  const base = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${base}/uploads/resumes/${encodeURIComponent(filename)}`;
}
