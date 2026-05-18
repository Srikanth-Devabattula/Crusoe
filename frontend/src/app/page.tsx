import type { Metadata } from "next";

import { HeroSection } from "@/components/hero";
import { PageContainer } from "@/components/common/PageContainer";
import { Section } from "@/components/common/Section";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Crusoe Tech — quality assurance, engineering services, and software development for reliable, high-impact solutions.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PageContainer>
        <Section title="Featured Services">
          <p className="text-gray-600">Services preview placeholder.</p>
        </Section>
      </PageContainer>
    </>
  );
}
