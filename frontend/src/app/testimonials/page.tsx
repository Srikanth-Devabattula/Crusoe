import { TestimonialsSection } from "@/components/home";
import {
  TestimonialsHero,
  VideoTestimonialsSection,
} from "@/components/testimonials";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Testimonials",
  "What our clients say about Crusoe Tech — client success stories and reviews."
);

export default function TestimonialsPage() {
  return (
    <>
      <TestimonialsHero />
      <TestimonialsSection variant="page" />
      <VideoTestimonialsSection />
    </>
  );
}
