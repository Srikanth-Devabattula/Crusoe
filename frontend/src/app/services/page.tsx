import {
  ServicesCtaSection,
  ServicesGridSection,
  ServicesHero,
  ServicesWhyChooseSection,
} from "@/components/services";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Services",
  "Quality assurance, automated testing, CAD customisation, and software tooling — engineering solutions that deliver impact."
);

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGridSection />
      <ServicesWhyChooseSection />
      <ServicesCtaSection />
    </>
  );
}
