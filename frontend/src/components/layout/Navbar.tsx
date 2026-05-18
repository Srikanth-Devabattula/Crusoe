"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants";

const navLinks = [
  { href: ROUTES.home, label: "Home" },
  {
    href: ROUTES.services,
    label: "Services",
    hasDropdown: true,
  },
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.careers, label: "Careers" },
  {
    href: ROUTES.testimonials,
    label: "Testimonials",
  },
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.news, label: "News" },
  { href: ROUTES.contact, label: "Contact" },
];

const SCROLL_DELTA = 8;
const TOP_REVEAL_OFFSET = 20;

export function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateNavbar = () => {
      const currentY = window.scrollY;

      if (currentY <= TOP_REVEAL_OFFSET) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + SCROLL_DELTA) {
        // Scrolling down — hide navbar
        setNavVisible(false);
        setMobileOpen(false);
      } else if (currentY < lastScrollY.current - SCROLL_DELTA) {
        // Scrolling up — show navbar
        setNavVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateNavbar);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-transparent bg-white/95 backdrop-blur-md transition-transform duration-300 ease-in-out will-change-transform",
        navVisible ? "translate-y-0 shadow-sm" : "-translate-y-full"
      )}
    >
      <nav className="hero-container">
        <div className="flex h-[72px] items-center gap-3 sm:h-[78px] lg:h-[84px] xl:h-[88px]">
          {/* Logo */}
          <Link href={ROUTES.home} className="relative z-10 shrink-0">
            <Image
              src="/images/global/logo.png"
              alt="Crusoe Tech"
              width={220}
              height={70}
              priority
              className="h-auto w-[128px] sm:w-[148px] md:w-[168px] lg:w-[172px] xl:w-[190px] 2xl:w-[205px]"
            />
          </Link>

          {/* Desktop links — centered in remaining space */}
          <div className="hidden min-w-0 flex-1 lg:flex lg:justify-center xl:px-2">
            <ul className="flex items-center gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <li key={link.href} className="relative shrink-0 px-0.5 lg:px-1">
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative flex items-center gap-0.5 whitespace-nowrap text-[13px] font-medium transition-colors duration-300 xl:text-[14px]",
                        isActive
                          ? "text-brand"
                          : "text-[#2D3748] hover:text-brand"
                      )}
                    >
                      {link.label}

                      {link.hasDropdown && (
                        <ChevronDown className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                      )}

                      <span
                        className={cn(
                          "absolute -bottom-2.5 left-0 h-[2px] rounded-full bg-brand transition-all duration-300 xl:-bottom-3 xl:h-[2.5px]",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop CTA */}
          <Link
            href={ROUTES.contact}
            className="relative z-10 hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_30px_rgba(108,191,42,0.25)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_12px_32px_rgba(108,191,42,0.3)] lg:ml-5 lg:inline-flex xl:ml-7 xl:px-6 xl:py-3 xl:text-[14px]"
          >
            Get In Touch
            <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="ml-auto rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed left-0 top-[72px] z-40 h-[calc(100vh-72px)] w-full overflow-y-auto bg-white transition-all duration-300 sm:top-[78px] sm:h-[calc(100vh-78px)] lg:hidden",
          mobileOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0"
        )}
      >
        <div className="px-4 py-4 sm:px-6">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-300",
                      isActive
                        ? "bg-brand-muted/60 text-brand"
                        : "text-[#2D3748] hover:bg-gray-50 hover:text-brand"
                    )}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && <ChevronDown size={17} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4">
            <Link
              href={ROUTES.contact}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Get In Touch
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
