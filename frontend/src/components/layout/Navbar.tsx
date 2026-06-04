"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants";

const navLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.services, label: "Services" },
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
          "fixed inset-x-0 top-0 z-50 w-full",
          navVisible
            ? "translate-y-0"
            : "-translate-y-full",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <nav className="w-full border-b border-[#e8edf3] bg-[#EFF4F9] shadow-[0_4px_20px_rgba(8,21,38,0.08)]">
          <div className="mx-auto flex h-16 w-full max-w-[1760px] items-center justify-between gap-1 px-4 sm:h-[4.5rem] sm:gap-2 sm:px-5 lg:gap-4 lg:px-3 xl:gap-5 xl:px-4 desktop:gap-6 desktop:px-6 2xl:gap-8 2xl:px-8">
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="shrink-0 outline-none"
          >
            <Image
              src="/images/global/logo.png"
              alt="Crusoe Tech"
              width={280}
              height={88}
              priority
              className="h-auto w-[200px] sm:w-[216px] lg:w-[168px] xl:w-[190px] desktop:w-[242px] 2xl:w-[292px]"
            />
          </Link>

          {/* Desktop Menu — from 1024px; hamburger below */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex lg:px-2 xl:px-4">
            <ul className="flex min-w-0 flex-1 items-center justify-center gap-1 lg:gap-1.5 xl:gap-2 desktop:gap-2.5 2xl:gap-3">
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
                        "group relative inline-flex h-9 shrink-0 items-center gap-0.5 whitespace-nowrap px-2 text-[13px] font-bold uppercase tracking-[0.02em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 xl:h-10 xl:px-2.5 xl:text-[14px] xl:tracking-[0.04em] desktop:h-11 desktop:px-3 desktop:text-[16px] desktop:tracking-[0.06em] 2xl:px-4 2xl:tracking-[0.08em]",
                        isActive
                          ? "text-brand"
                          : "text-slate-700 hover:text-brand"
                      )}
                    >
                      {link.label}

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
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand px-2.5 py-2 text-[11px] font-semibold text-white shadow-[0_10px_30px_rgba(126,168,73,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark lg:ml-1 lg:inline-flex xl:ml-0 xl:rounded-xl xl:px-3.5 xl:py-2.5 xl:text-[12px] desktop:gap-2 desktop:rounded-2xl desktop:px-5 desktop:py-2.5 desktop:text-[14px] 2xl:px-6 2xl:py-3 2xl:text-[15px]"
          >
            Get In Touch

            <ArrowRight
              className="size-3.5 xl:size-4 desktop:size-4"
              strokeWidth={2.5}
            />
          </Link>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="ml-auto grid size-11 shrink-0 place-items-center rounded-2xl border border-[#e8edf3] bg-[#E8EEF5] text-[#081526] transition-colors hover:bg-[#dfe7f0] sm:size-12 lg:hidden"
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
            "w-full overflow-hidden border-b border-[#e8edf3] bg-[#EFF4F9] transition-all duration-300 lg:hidden",
            mobileOpen
              ? "max-h-[1000px] shadow-[0_8px_24px_rgba(8,21,38,0.06)]"
              : "pointer-events-none max-h-0 border-b-0 opacity-0 shadow-none"
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="mx-auto max-w-[1760px] p-4 sm:px-6 lg:px-8">
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
                        "relative block rounded-2xl px-4 py-4 text-[16px] font-bold uppercase tracking-[0.08em] transition-colors duration-300",
                        isActive
                          ? "bg-[#E8F0DC] text-brand"
                          : "text-slate-700 hover:bg-[#f2f6fa] hover:text-brand"
                      )}
                    >
                      {link.label}

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