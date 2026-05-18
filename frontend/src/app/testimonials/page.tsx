import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Testimonials",
  "What our clients say about us."
);

export default function TestimonialsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Testimonials"
        description="Trusted by businesses worldwide."
      />
      <Section title="Client Reviews">
        <p className="text-gray-600">Testimonials carousel placeholder.</p>
      </Section>
    </PageContainer>
  );
}
