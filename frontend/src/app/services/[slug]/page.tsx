import { notFound } from "next/navigation";

import { CadCamCaeServicePage } from "@/components/services/CadCamCaeServicePage";
import { EngineeringServicesPage } from "@/components/services/EngineeringServicesPage";
import { SoftwareDevelopmentPage } from "@/components/services/SoftwareDevelopmentPage";
import { SoftwareQualityServicePage } from "@/components/services/SoftwareQualityServicePage";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { getServicePage, servicePageSlugs } from "@/data/servicePages";
import { createPageMetadata } from "@/lib/createPageMetadata";

const CAD_CAM_SLUG = "cad-cam-cae-software-testing";
const SOFTWARE_QUALITY_SLUG = "software-quality";
const ENGINEERING_SLUG = "engineering-services";
const SOFTWARE_DEVELOPMENT_SLUG = "software-development";

interface ServiceDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return servicePageSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ServiceDetailPageProps) {
  const page = getServicePage(params.slug);

  if (!page) {
    return createPageMetadata("Service", "Explore Crusoe Tech services.");
  }

  return createPageMetadata(page.title, page.description);
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const page = getServicePage(params.slug);

  if (!page) {
    notFound();
  }

  if (params.slug === CAD_CAM_SLUG) {
    return <CadCamCaeServicePage />;
  }

  if (params.slug === SOFTWARE_QUALITY_SLUG) {
    return <SoftwareQualityServicePage />;
  }

  if (params.slug === ENGINEERING_SLUG) {
    return <EngineeringServicesPage />;
  }

  if (params.slug === SOFTWARE_DEVELOPMENT_SLUG) {
    return <SoftwareDevelopmentPage />;
  }

  return <ServiceDetailView page={page} />;
}
