import { clsx, type ClassValue } from "clsx";

/** Merge class names with clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
