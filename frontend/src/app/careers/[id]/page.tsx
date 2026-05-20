import { JobDetailView } from "@/components/careers/JobDetailView";
import { createPageMetadata } from "@/lib/createPageMetadata";

interface CareerJobPageProps {
  params: { id: string };
}

export function generateMetadata({ params }: CareerJobPageProps) {
  return createPageMetadata("Job details", "View role details and apply at Crusoe Tech.");
}

export default function CareerJobPage({ params }: CareerJobPageProps) {
  return <JobDetailView jobId={params.id} />;
}
