import { HeroSection } from "@/components/hero";
import {
  AchievementsSection,
  LogosSection,
  OurServicesSection,
  WhyChooseUsSection,
  TestimonialsSection,
  StartAConvoSection,
} from "@/components/home";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";
import { HOME_SEO_DESCRIPTION, HOME_SEO_TITLE } from "@/lib/seo";

const homeMetadata = createPageMetadata(
  "Onshape 3D CAD Engineering Services Experts",
  HOME_SEO_DESCRIPTION,
  { path: ROUTES.home }
);

export const metadata = {
  ...homeMetadata,
  title: { absolute: HOME_SEO_TITLE },
  openGraph: {
    ...homeMetadata.openGraph,
    title: HOME_SEO_TITLE,
  },
  twitter: {
    ...homeMetadata.twitter,
    title: HOME_SEO_TITLE,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AchievementsSection />
      <LogosSection />
      <OurServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      {/* <StartAConvoSection /> */}
    </>
  );
}
