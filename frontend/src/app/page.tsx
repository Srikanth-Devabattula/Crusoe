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

export const metadata = createPageMetadata(
  "Home",
  "Crusoe Tech — quality assurance, engineering services, and software development for reliable, high-impact solutions.",
  { path: ROUTES.home }
);

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
