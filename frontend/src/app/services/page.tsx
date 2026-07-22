import {
  ServicesCtaSection,
  ServicesGridSection,
  ServicesHero,
  ServicesWhyChooseSection,
} from "@/components/services";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Services",
  "Quality assurance, automated testing, CAD customisation, and software tooling — engineering solutions that deliver impact.",
  { path: ROUTES.services }
);

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGridSection />
      <ServicesWhyChooseSection />
      {/* <ServicesCtaSection /> */}
    </>
  );
}
