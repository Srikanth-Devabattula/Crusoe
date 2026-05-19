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
        setNavVisible(false);
        setMobileOpen(false);
      } else if (currentY < lastScrollY.current - SCROLL_DELTA) {
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

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
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
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-5",
          navVisible
            ? "translate-y-0"
            : "-translate-y-full",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <nav className="mx-auto w-[90%] max-w-[1760px] rounded-[28px] border border-[#e8edf3] bg-[#FDFEFF] shadow-[0_8px_24px_rgba(8,21,38,0.1)]">
          <div className="flex h-16 items-center justify-between gap-2 px-3 sm:h-[4.5rem] sm:gap-3 sm:px-4 lg:gap-2 lg:px-3 xl:gap-4 xl:px-5">
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="shrink-0 outline-none"
          >
            <Image
              src="/images/global/logo.png"
              alt="Crusoe Tech"
              width={220}
              height={70}
              priority
              className="h-auto w-[118px] sm:w-[132px] lg:w-[128px] xl:w-[150px] 2xl:w-[180px]"
            />
          </Link>

          {/* Desktop Menu — from 1024px; hamburger below */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-0.5 lg:gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" &&
                    pathname.startsWith(link.href));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative inline-flex h-10 shrink-0 items-center gap-0.5 whitespace-nowrap px-2 text-[10px] font-bold uppercase tracking-[0.04em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 lg:px-2 lg:text-[10px] xl:h-11 xl:px-2.5 xl:text-[11px] xl:tracking-[0.06em] 2xl:px-4 2xl:text-[13px] 2xl:tracking-[0.08em]",
                        isActive
                          ? "text-brand"
                          : "text-slate-700 hover:text-brand"
                      )}
                    >
                      {link.label}

                      {link.hasDropdown && (
                        <ChevronDown className="size-3 shrink-0 text-brand lg:size-3.5" />
                      )}

                      <span
                        className={cn(
                          "absolute bottom-1 left-0 h-[2px] rounded-full bg-brand transition-all duration-300",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CTA */}
          <Link
            href={ROUTES.contact}
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl bg-brand px-3.5 py-2 text-[11px] font-semibold text-white shadow-[0_10px_30px_rgba(108,191,42,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark lg:inline-flex xl:gap-2 xl:px-5 xl:py-2.5 xl:text-[13px] 2xl:px-6 2xl:py-3 2xl:text-[14px]"
          >
            Get In Touch

            <ArrowRight
              className="h-4 w-4"
              strokeWidth={2.5}
            />
          </Link>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="ml-auto grid size-11 shrink-0 place-items-center rounded-2xl border border-[#e8edf3] bg-[#FDFEFF] text-[#081526] transition-colors hover:bg-[#f2f6fa] sm:size-12 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={
              mobileOpen ? "Close menu" : "Open menu"
            }
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "mx-auto w-[90%] max-w-[1760px] overflow-hidden rounded-[28px] transition-all duration-300 lg:hidden",
            mobileOpen
              ? "mt-3 max-h-[1000px] border border-[#e8edf3] bg-[#FDFEFF] shadow-[0_8px_24px_rgba(8,21,38,0.08)]"
              : "pointer-events-none mt-0 max-h-0 border-0 bg-transparent p-0 opacity-0 shadow-none"
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="p-4">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" &&
                    pathname.startsWith(link.href));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "relative flex items-center justify-between rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-300",
                        isActive
                          ? "bg-[#E8F5DC] text-brand"
                          : "text-slate-700 hover:bg-[#f2f6fa] hover:text-brand"
                      )}
                    >
                      {link.label}

                      {link.hasDropdown && (
                        <ChevronDown className="size-4" />
                      )}

                      {isActive && (
                        <span
                          className="absolute bottom-2 left-4 right-4 h-0.5 rounded-full bg-brand"
                          aria-hidden
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <Link
                href={ROUTES.contact}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-brand-dark"
              >
                Get In Touch

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}