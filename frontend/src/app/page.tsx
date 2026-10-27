import { HeroSection } from "@/components/hero";
import {
  AchievementsSection,
  LogosSection,
  OurServicesSection,
  WhyChooseUsSection,
  TestimonialsSection,
  StartAConvoSection,
} from "@/components/home";
import { HomePageH1 } from "@/components/seo/HomePageH1";
import { WebsiteJsonLd } from "@/components/seo/WebsiteJsonLd";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";
import {
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
  SITE_OG_NAME,
} from "@/lib/seo";

const homeMetadata = createPageMetadata(
  "Onshape 3D CAD Engineering Services Experts",
  HOME_SEO_DESCRIPTION,
  { path: ROUTES.home }
);

export const metadata = {
  ...homeMetadata,
  title: { absolute: HOME_SEO_TITLE },
  description: HOME_SEO_DESCRIPTION,
  alternates: {
    canonical: ROUTES.home,
  },
  openGraph: {
    ...homeMetadata.openGraph,
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    siteName: SITE_OG_NAME,
    url: ROUTES.home,
  },
  twitter: {
    ...homeMetadata.twitter,
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <HomePageH1 />
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
