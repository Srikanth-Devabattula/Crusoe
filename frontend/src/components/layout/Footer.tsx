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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container-page py-12 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          <div className="lg:col-span-1">
            <Link href={ROUTES.home} className="inline-block mb-3">
              <Image
                src="/images/global/logo.png"
                alt="Crusoe Tech"
                width={180}
                height={60}
                className="h-auto w-[120px] sm:w-[140px]"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4 max-w-sm">
              Delivering quality software solutions that help businesses
              innovate, grow and lead in competitive markets.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-8 h-8 bg-brand rounded flex items-center justify-center text-white hover:bg-brand-dark transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-brand rounded flex items-center justify-center text-white hover:bg-brand-dark transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Head Office
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <FaPhone className="w-3 h-3 text-brand" />
              <Link
                href="tel:+919948059533"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                +91 9948059533
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <FaEnvelope className="w-3 h-3 text-brand" />
              <Link
                href="mailto:info@crusoetec.com"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                info@crusoetec.com
              </Link>
            </div>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="w-3 h-3 text-brand mt-0.5" />
              <p className="text-sm text-gray-600">
                A-201, Tech Park, Bengaluru,
                <br />
                Karnataka 560100, India
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Hyderabad
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <FaPhone className="w-3 h-3 text-brand" />
              <Link
                href="tel:+918179467755"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                +91 8179467755
              </Link>
            </div>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="w-3 h-3 text-brand mt-0.5" />
              <p className="text-sm text-gray-600">
                Plot No.27 Gachibowli, Behind Radisson
                <br />
                Hotel, Hyderabad India 500032
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Copyright © {year} {SITE_NAME} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
