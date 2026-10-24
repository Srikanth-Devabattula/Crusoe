import { AxiosError } from "axios";
import type { ApiResponse } from "@/types";

/**
 * Extract a user-safe message from an API error response
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.message) return data.message;
    if (error.response?.status === 503) {
      return "API is temporarily unavailable. Wait a minute and try again.";
    }
    if (!error.response && error.code === "ERR_NETWORK") {
      return "Cannot reach the API. Check that backend.crusoetec.com is running.";
    }
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}
