import { AxiosError } from "axios";
import type { ApiResponse } from "@/types";

/**
 * Extract a user-safe message from an API error response
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}
