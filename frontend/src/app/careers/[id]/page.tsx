import type { Metadata } from "next";

import { JobDetailView } from "@/components/careers/JobDetailView";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";
import { plainTextExcerpt } from "@/lib/seo";
import { jobService } from "@/services";

interface CareerJobPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: CareerJobPageProps): Promise<Metadata> {
  const path = ROUTES.careerJob(params.id);

  try {
    const res = await jobService.getById(params.id);
    const job = res.data;
    if (!job?.title) {
      throw new Error("Missing job");
    }

    const description =
      job.shortDescription?.trim() ||
      plainTextExcerpt(job.longDescription || "", 160) ||
      "View role details and apply at Crusoe Tech.";

    return createPageMetadata(job.title, description, { path });
  } catch {
    return createPageMetadata(
      "Job details",
      "View role details and apply at Crusoe Tech.",
      { path }
    );
  }
}

export default function CareerJobPage({ params }: CareerJobPageProps) {
  return <JobDetailView jobId={params.id} />;
}
