"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants";

const adminLinks = [
  { href: ROUTES.admin.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.admin.blogs, label: "Blogs", icon: FileText },
  { href: ROUTES.admin.jobs, label: "Jobs", icon: Briefcase },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-gray-200 bg-gray-50 lg:w-64 lg:border-b-0 lg:border-r lg:min-h-screen">
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Admin Panel
        </p>
        <nav className="mt-6 flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap",
                pathname === href
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <Link
            href={ROUTES.admin.login}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 lg:mt-4"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </nav>
      </div>
    </aside>
  );
}
