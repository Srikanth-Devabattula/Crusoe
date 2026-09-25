import Image from "next/image";
import Link from "next/link";
import {
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ROUTES, SITE_LOGO_SRC, SITE_NAME } from "@/constants";
import { CONTACT_EMAIL, contactInfoBlocks } from "@/data/contactPage";

const quickLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.smartsourcing, label: "SmartSourcing" },
  { href: ROUTES.blog, label: "Blog & News" },
  { href: ROUTES.careers, label: "Careers" },
  { href: ROUTES.contact, label: "Contact Us" },
];

const services = [
  { label: "Engineering Services", href: ROUTES.servicesEngineering },
  { label: "CAD/CAM/CAE Software Testing", href: ROUTES.servicesCadCam },
  { label: "Software Quality", href: ROUTES.servicesQuality },
  { label: "Software Development", href: ROUTES.servicesDevelopment },
];

const linkClass =
  "text-xs text-[#5b6472] transition-colors duration-300 hover:text-brand sm:text-[13px]";

const headingClass =
  "mb-2 text-xs font-bold uppercase tracking-[0.08em] text-gray-900 sm:text-[13px]";

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
        className="absolute -left-24 top-0 h-[200px] w-[200px] rounded-full bg-brand/[0.12] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-[220px] w-[220px] rounded-full bg-brand/[0.1] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-0 h-[1px] w-[min(90%,720px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(126,168,73,0.45),transparent)]"
        aria-hidden
      />

      <div className="hero-container relative z-10 px-2 py-2 sm:px-3 sm:py-3">
        <div className="rounded-[20px] border border-[#e7efe0]/80 bg-white/55 px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-5 sm:py-5 lg:px-6 lg:py-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div className="lg:col-span-1">
              <Link href={ROUTES.home} className="mb-2 inline-block">
                <Image
                  src={SITE_LOGO_SRC}
                  alt="Crusoe Tech"
                  width={320}
                  height={120}
                  unoptimized
                  className="h-auto w-[150px] sm:w-[170px] lg:w-[180px]"
                />
              </Link>
              {/* <p className="mb-3 max-w-xs text-xs leading-snug text-[#5b6472] sm:text-[13px]">
                Quality software solutions that help businesses innovate and
                grow.
              </p> */}
              <div className="flex items-center gap-3">
                <Image
                  src="/images/global/iso.png"
                  alt="ISO 27001 certified"
                  width={100}
                  height={50}
                  className="h-auto w-[60px] sm:w-[72px]"
                />
                <div className="flex gap-2">
                  <Link
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-[0_6px_16px_rgba(126,168,73,0.25)] transition-all duration-300 hover:bg-brand-dark"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-[0_6px_16px_rgba(126,168,73,0.25)] transition-all duration-300 hover:bg-brand-dark"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:pl-8 xl:pl-10">
              <h3 className={headingClass}>Quick Links</h3>
              <ul className="space-y-1.5">
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
              <Link href={ROUTES.services} className="group inline-block">
                <h3 className={`${headingClass} group-hover:text-brand transition-colors duration-300`}>
                  Services
                </h3>
              </Link>
              <ul className="space-y-1.5">
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
                <h3 className={headingClass}>
                  {footerOfficeHeadings[headOffice.id] ?? headOffice.title}
                </h3>
                <div className="mb-1.5 flex items-center gap-2">
                  <FaPhone className="h-3 w-3 shrink-0 text-brand" />
                  <Link href={headOffice.tel} className={linkClass}>
                    {headOffice.phone.replace(/^\+91/, "+91 ")}
                  </Link>
                </div>
                <div className="mb-1.5 flex items-center gap-2">
                  <FaEnvelope className="h-3 w-3 shrink-0 text-brand" />
                  <Link href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                    {CONTACT_EMAIL}
                  </Link>
                </div>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                  <Link
                    href={headOffice.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} leading-snug`}
                  >
                    {headOffice.address}
                  </Link>
                </div>
              </div>

              <div className="mt-3 border-t border-[#e7efe0] pt-3">
                <h3 className={headingClass}>
                  {footerOfficeHeadings[hyderabadOffice.id] ??
                    hyderabadOffice.title}
                </h3>
                <div className="mb-1.5 flex items-center gap-2">
                  <FaPhone className="h-3 w-3 shrink-0 text-brand" />
                  <Link href={hyderabadOffice.tel} className={linkClass}>
                    {hyderabadOffice.phone.replace(/^\+91/, "+91 ")}
                  </Link>
                </div>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                  <Link
                    href={hyderabadOffice.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} leading-snug`}
                  >
                    {hyderabadOffice.address}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-[#e7efe0] pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-left text-xs text-[#6b7280]">
              Copyright © {year} {SITE_NAME}. All Rights Reserved.
            </p>
            <Link
              href={ROUTES.privacyPolicy}
              className="text-left text-xs text-[#6b7280] transition-colors hover:text-brand sm:text-right sm:text-[13px]"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
