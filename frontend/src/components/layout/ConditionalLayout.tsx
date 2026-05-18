"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "./MainLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
