import Link from "next/link";
import { ROUTES, SITE_NAME } from "@/constants";

const footerLinks = [
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.services, label: "Services" },
  { href: ROUTES.careers, label: "Careers" },
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.contact, label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">{SITE_NAME}</p>
            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Professional technology solutions. Content placeholder for footer
              description.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-gray-900">Quick Links</p>
            <ul className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
