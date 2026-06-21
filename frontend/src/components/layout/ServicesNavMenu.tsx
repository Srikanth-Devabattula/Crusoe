"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ROUTES } from "@/constants";
import { servicesNavItems, type ServiceNavItem } from "@/data/servicesNav";
import { cn } from "@/lib/cn";

const linkClassName =
  "group relative inline-flex h-9 shrink-0 items-center gap-0.5 whitespace-nowrap px-2 text-[13px] font-bold uppercase tracking-[0.02em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 xl:h-10 xl:px-2.5 xl:text-[14px] xl:tracking-[0.04em] desktop:h-11 desktop:px-3 desktop:text-[16px] desktop:tracking-[0.06em] 2xl:px-4 2xl:tracking-[0.08em]";

const CLOSE_DELAY_MS = 150;

function isNavItemActive(item: ServiceNavItem, pathname: string): boolean {
  if (item.href && pathname === item.href) return true;
  return item.children?.some((child) => pathname === child.href) ?? false;
}

interface ServicesNavMenuProps {
  isActive: boolean;
  onNavigate?: () => void;
  variant: "desktop" | "mobile";
}

export function ServicesNavMenu({
  isActive,
  onNavigate,
  variant,
}: ServicesNavMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(
    servicesNavItems[0]?.id ?? ""
  );
  const containerRef = useRef<HTMLLIElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCategory =
    servicesNavItems.find((item) => item.id === activeCategoryId) ??
    servicesNavItems[0];

  const showSubPanel = Boolean(activeCategory?.children?.length);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleOpen = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const handleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      const match = servicesNavItems.find((item) =>
        isNavItemActive(item, pathname)
      );
      if (match) {
        setActiveCategoryId(match.id);
      }
    }, CLOSE_DELAY_MS);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    const match = servicesNavItems.find((item) => isNavItemActive(item, pathname));
    if (match) {
      setActiveCategoryId(match.id);
    }
  }, [pathname]);

  useEffect(() => {
    if (variant !== "desktop" || !open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearCloseTimer();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, variant]);

  if (variant === "mobile") {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-[16px] font-bold uppercase tracking-[0.08em] transition-colors duration-300",
            isActive || open
              ? "bg-[#E8F0DC] text-brand"
              : "text-slate-700 hover:bg-[#f2f6fa] hover:text-brand"
          )}
          aria-expanded={open}
        >
          <Link
            href={ROUTES.services}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.();
            }}
            className="flex-1"
          >
            Services
          </Link>
          <ChevronDown
            className={cn(
              "size-5 transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <ul className="mt-1 space-y-1 pb-2 pl-2">
            {servicesNavItems.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <div className="rounded-xl bg-white/70 px-3 py-2">
                    <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-brand">
                      {item.label}
                    </p>
                    <ul className="mt-2 space-y-1 border-l-2 border-brand/20 pl-3">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;

                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onNavigate}
                              className={cn(
                                "block py-2 text-[14px] font-medium transition-colors",
                                childActive
                                  ? "text-brand"
                                  : "text-slate-700 hover:text-brand"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-[14px] font-semibold transition-colors",
                      pathname === item.href
                        ? "bg-[#E8F0DC] text-brand"
                        : "text-slate-700 hover:bg-[#f2f6fa] hover:text-brand"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <Link
        href={ROUTES.services}
        className={cn(
          linkClassName,
          "gap-1",
          isActive || open
            ? "text-brand"
            : "text-slate-700 hover:text-brand"
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Services
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-300 xl:size-4 desktop:size-4",
            open && "rotate-180"
          )}
          aria-hidden
        />
        <span
          className={cn(
            "absolute bottom-1 left-0 h-[2px] rounded-full bg-brand transition-all duration-300",
            isActive || open ? "w-full" : "w-0 group-hover:w-full"
          )}
          aria-hidden
        />
      </Link>

      <div
        className={cn(
          "absolute left-0 top-full z-50 w-max pt-3 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none"
        )}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <div className="flex overflow-hidden rounded-sm bg-white shadow-[0_12px_40px_rgba(8,21,38,0.12)]">
          <div className="min-w-[220px] px-6 py-5">
            <ul className="space-y-4">
              {servicesNavItems.map((item) => {
                const pathActive = isNavItemActive(item, pathname);

                if (item.href) {
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onMouseEnter={() => {
                          handleOpen();
                          setActiveCategoryId(item.id);
                        }}
                        className={cn(
                          "block text-[15px] font-medium transition-colors",
                          pathname === item.href
                            ? "text-brand"
                            : "text-[#081526] hover:text-brand"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => {
                        handleOpen();
                        setActiveCategoryId(item.id);
                      }}
                      onFocus={() => setActiveCategoryId(item.id)}
                      className={cn(
                        "w-full text-left text-[15px] font-medium transition-colors",
                        pathActive
                          ? "text-brand"
                          : "text-[#081526] hover:text-brand"
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {showSubPanel && (
            <>
              <div
                className="w-px shrink-0 self-stretch bg-[#e8edf3]"
                aria-hidden
              />

              <div className="min-w-[300px] px-6 py-5">
                <ul className="space-y-4">
                  {activeCategory?.children?.map((child) => {
                    const childActive = pathname === child.href;

                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block text-[15px] font-medium transition-colors",
                            childActive
                              ? "text-brand"
                              : "text-[#081526] hover:text-brand"
                          )}
                          onMouseEnter={handleOpen}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
