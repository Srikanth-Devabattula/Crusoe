export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  careers: "/careers",
  testimonials: "/testimonials",
  blog: "/blog",
  news: "/news",
  contact: "/contact",
  thankYou: "/thank-you",
  admin: {
    login: "/admin/login",
    dashboard: "/admin/dashboard",
    blogs: "/admin/blogs",
    jobs: "/admin/jobs",
  },
} as const;

export const SITE_NAME = "Crusoe Tech";
