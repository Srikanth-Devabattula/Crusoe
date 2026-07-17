import type { Metadata } from "next";

import { HeroSection } from "@/components/hero";
import {
  AchievementsSection,
  LogosSection,
  OurServicesSection,
  WhyChooseUsSection,
  TestimonialsSection,
  StartAConvoSection,
} from "@/components/home";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Crusoe Tech — quality assurance, engineering services, and software development for reliable, high-impact solutions.",
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
