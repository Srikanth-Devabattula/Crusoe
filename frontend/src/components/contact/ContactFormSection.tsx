"use client";

import { ContactEnquiryForm } from "./ContactEnquiryForm";
import { ContactInfoCard } from "./ContactInfoCard";

export function ContactFormSection() {
  return (
    <section
      id="contact-form"
      aria-label="Contact enquiry"
      className="section-padding scroll-mt-24 bg-[#F7F9F4]"
    >
      <div className="hero-container">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:gap-12">
          <ContactEnquiryForm />
          <ContactInfoCard />
        </div>
      </div>
    </section>
  );
}
