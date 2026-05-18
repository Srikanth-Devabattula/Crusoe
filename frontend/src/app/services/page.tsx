import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Services",
  "Explore our professional technology services."
);

export default function ServicesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Our Services"
        description="Solutions tailored to your business needs."
      />
      <Section title="Service List">
        <p className="text-gray-600">Services grid placeholder.</p>
      </Section>
    </PageContainer>
  );
}
