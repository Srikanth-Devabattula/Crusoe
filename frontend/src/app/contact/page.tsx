import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { FormPlaceholder } from "@/components/forms/FormPlaceholder";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Contact",
  "Get in touch with the Crusoe Tech team."
);

export default function ContactPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Contact Us"
        description="We would love to hear from you."
      />
      <Section title="Send a Message">
        <FormPlaceholder name="Contact" />
      </Section>
    </PageContainer>
  );
}
