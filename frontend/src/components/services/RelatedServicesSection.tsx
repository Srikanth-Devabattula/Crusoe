import { getRelatedServiceLinks } from "@/data/relatedServices";

import { ServiceAdvantageSection } from "./ServiceAdvantageSection";

interface RelatedServicesSectionProps {
  currentHref: string;
}

export function RelatedServicesSection({ currentHref }: RelatedServicesSectionProps) {
  return (
    <ServiceAdvantageSection
      eyebrow="Explore more"
      heading="Related Services"
      links={getRelatedServiceLinks(currentHref)}
    />
  );
}
