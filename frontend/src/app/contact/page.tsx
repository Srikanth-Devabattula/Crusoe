import {
  ContactFormSection,
  ContactHero,
  ContactOfficesSection,
} from "@/components/contact";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Contact",
  "Get in touch with Crusoe Technologies — Visakhapatnam and Hyderabad offices, enquiry form, and instant WhatsApp support.",
  { path: ROUTES.contact }
);

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <ContactOfficesSection />
    </>
  );
}
