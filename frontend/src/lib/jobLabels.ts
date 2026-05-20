import type { Job } from "@/types";

const JOB_TYPE_LABELS: Record<Job["type"], string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  remote: "Remote",
};

export function formatJobType(type: Job["type"]): string {
  return JOB_TYPE_LABELS[type] ?? type;
}
