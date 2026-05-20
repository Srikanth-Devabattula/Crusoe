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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#e7efe0]">
      {/* Base gradient */}
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,#ffffff_0%,#f8fbf4_42%,#f0f7ea_100%)]"
        aria-hidden
      />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      {/* Brand mesh */}
      <div className="absolute inset-0 opacity-[0.035]" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(#6CBF2A_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Glow accents */}
      <div
        className="absolute -left-24 top-0 h-[280px] w-[280px] rounded-full bg-brand/[0.12] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-[320px] w-[320px] rounded-full bg-brand/[0.1] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-0 h-[1px] w-[min(90%,720px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(108,191,42,0.45),transparent)]"
        aria-hidden
      />

      <div className="hero-container relative z-10 px-2 py-5 sm:px-3 sm:py-6 lg:px-4 lg:py-8">
        <div className="rounded-[28px] border border-[#e7efe0]/80 bg-white/55 px-6 py-10 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:px-8 lg:px-10 lg:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            <div className="lg:col-span-1">
              <Link href={ROUTES.home} className="mb-4 inline-block">
                <Image
                  src="/images/global/logo.png"
                  alt="Crusoe Tech"
                  width={180}
                  height={60}
                  className="h-auto w-[120px] sm:w-[140px]"
                />
              </Link>
              <p className="mb-5 max-w-sm text-sm leading-relaxed text-[#5b6472]">
                Delivering quality software solutions that help businesses
                innovate, grow and lead in competitive markets.
              </p>
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(108,191,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(108,191,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark"
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

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                Head Office
              </h3>
              <div className="mb-2.5 flex items-center gap-2">
                <FaPhone className="h-3.5 w-3.5 shrink-0 text-brand" />
                <Link href="tel:+919948059533" className={linkClass}>
                  +91 9948059533
                </Link>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <FaEnvelope className="h-3.5 w-3.5 shrink-0 text-brand" />
                <Link href="mailto:info@crusoetec.com" className={linkClass}>
                  info@crusoetec.com
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <p className="text-sm leading-relaxed text-[#5b6472]">
                  A-201, Tech Park, Bengaluru,
                  <br />
                  Karnataka 560100, India
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                Hyderabad
              </h3>
              <div className="mb-3 flex items-center gap-2">
                <FaPhone className="h-3.5 w-3.5 shrink-0 text-brand" />
                <Link href="tel:+918179467755" className={linkClass}>
                  +91 8179467755
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <p className="text-sm leading-relaxed text-[#5b6472]">
                  Plot No.27 Gachibowli, Behind Radisson
                  <br />
                  Hotel, Hyderabad India 500032
                </p>
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
