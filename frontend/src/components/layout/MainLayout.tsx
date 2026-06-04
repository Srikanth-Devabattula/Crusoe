"use client";

import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isFullBleedHero =
    pathname === "/" ||
    pathname === ROUTES.testimonials ||
    pathname === ROUTES.services ||
    pathname === ROUTES.about ||
    pathname === ROUTES.contact ||
    pathname === ROUTES.careers ||
    pathname === ROUTES.blog ||
    pathname.startsWith(`${ROUTES.blog}/`) ||
    pathname === ROUTES.news ||
    pathname.startsWith(`${ROUTES.news}/`);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main
        className={
          isFullBleedHero
            ? "site-main-bg relative flex-1"
            : "site-main-bg relative flex-1 pt-[72px] sm:pt-[78px] lg:pt-[84px] xl:pt-[88px]"
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
