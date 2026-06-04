import Image from "next/image";
import Link from "next/link";
import {
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ROUTES, SITE_NAME } from "@/constants";
import { CONTACT_EMAIL, contactInfoBlocks } from "@/data/contactPage";

const quickLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.services, label: "Services" },
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.careers, label: "Careers" },
  { href: ROUTES.contact, label: "Contact Us" },
];

const services = [
  { label: "CAD CAM CAE Software MTTRE", href: ROUTES.services },
  { label: "Software Quality", href: ROUTES.services },
  { label: "Engineering Services", href: ROUTES.services },
  { label: "Software Development", href: ROUTES.services },
];

const linkClass =
  "text-sm text-[#5b6472] transition-colors duration-300 hover:text-brand";

const footerOfficeHeadings: Record<string, string> = {
  vizag: "Head Office",
  hyderabad: "Hyderabad",
};

export function Footer() {
  const year = new Date().getFullYear();
  const [headOffice, hyderabadOffice] = contactInfoBlocks;

  return (
    <footer className="relative overflow-hidden border-t border-[#e7efe0]">
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,#ffffff_0%,#f8fbf4_42%,#f0f7ea_100%)]"
        aria-hidden
      />

      <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.035]" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(#7EA849_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div
        className="absolute -left-24 top-0 h-[280px] w-[280px] rounded-full bg-brand/[0.12] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-[320px] w-[320px] rounded-full bg-brand/[0.1] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-0 h-[1px] w-[min(90%,720px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(126, 168, 73,0.45),transparent)]"
        aria-hidden
      />

      <div className="hero-container relative z-10 px-2 py-5 sm:px-3 sm:py-6 lg:px-4 lg:py-8">
        <div className="rounded-[28px] border border-[#e7efe0]/80 bg-white/55 px-6 py-10 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:px-8 lg:px-10 lg:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-1">
              <Link href={ROUTES.home} className="mb-5 inline-block">
                <Image
                  src="/images/global/logo11.png"
                  alt="Crusoe Tech"
                  width={320}
                  height={120}
                  className="h-auto w-[200px] sm:w-[240px] lg:w-[260px]"
                />
              </Link>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#5b6472]">
                Delivering quality software solutions that help businesses
                innovate, grow and lead in competitive markets.
              </p>
              <Image
                src="/images/global/iso.png"
                alt="ISO 27001 certified"
                width={160}
                height={80}
                className="mb-5 h-auto w-[120px] sm:w-[140px]"
              />
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(126, 168, 73,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(126, 168, 73,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                Services
              </h3>
              <ul className="space-y-2.5">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link href={service.href} className={linkClass}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                  {footerOfficeHeadings[headOffice.id] ?? headOffice.title}
                </h3>
                <div className="mb-2.5 flex items-center gap-2">
                  <FaPhone className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <Link href={headOffice.tel} className={linkClass}>
                    {headOffice.phone.replace(/^\+91/, "+91 ")}
                  </Link>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <FaEnvelope className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <Link href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                    {CONTACT_EMAIL}
                  </Link>
                </div>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <Link
                    href={headOffice.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} leading-relaxed`}
                  >
                    {headOffice.address}
                  </Link>
                </div>
              </div>

              <div className="mt-8 border-t border-[#e7efe0] pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                  {footerOfficeHeadings[hyderabadOffice.id] ??
                    hyderabadOffice.title}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  <FaPhone className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <Link href={hyderabadOffice.tel} className={linkClass}>
                    {hyderabadOffice.phone.replace(/^\+91/, "+91 ")}
                  </Link>
                </div>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <Link
                    href={hyderabadOffice.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} leading-relaxed`}
                  >
                    {hyderabadOffice.address}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#e7efe0] pt-6">
            <p className="text-center text-sm text-[#6b7280]">
              Copyright © {year} {SITE_NAME}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
