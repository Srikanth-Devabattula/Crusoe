import type { AdminPermission, User } from "@/types";
import { ROUTES } from "@/constants";

export const ADMIN_PERMISSIONS: Array<{
  key: AdminPermission;
  label: string;
}> = [
  { key: "blogs", label: "Blogs" },
  { key: "news", label: "News" },
  { key: "jobs", label: "Jobs" },
  { key: "testimonials", label: "Testimonials" },
  { key: "team", label: "Team" },
  { key: "partners", label: "Partner Logos" },
  { key: "contacts", label: "Contact Forms" },
  { key: "applications", label: "Job Applications" },
];

export const EMPTY_PERMISSIONS: Record<AdminPermission, boolean> = {
  blogs: false,
  news: false,
  jobs: false,
  testimonials: false,
  team: false,
  partners: false,
  contacts: false,
  applications: false,
};

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function hasPermission(
  user: User | null,
  permission: AdminPermission
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return Boolean(user.permissions?.[permission]);
}

export function getDefaultAdminPath(user: User | null): string {
  if (!user) return ROUTES.admin.login;

  for (const { key } of ADMIN_PERMISSIONS) {
    const href = PERMISSION_ROUTES[key];
    if (hasPermission(user, key)) return href;
  }

  return ROUTES.admin.login;
}

export const PERMISSION_ROUTES: Record<AdminPermission, string> = {
  blogs: ROUTES.admin.blogs,
  news: ROUTES.admin.news,
  jobs: ROUTES.admin.jobs,
  testimonials: ROUTES.admin.testimonials,
  team: ROUTES.admin.team,
  partners: ROUTES.admin.partners,
  contacts: ROUTES.admin.contacts,
  applications: ROUTES.admin.applications,
};

export function getPermissionForPath(pathname: string): AdminPermission | null {
  for (const [key, href] of Object.entries(PERMISSION_ROUTES)) {
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      return key as AdminPermission;
    }
  }
  return null;
}

export function canAccessPath(user: User | null, pathname: string): boolean {
  if (!user) return false;
  const required = getPermissionForPath(pathname);
  if (!required) return true;
  return hasPermission(user, required);
}
