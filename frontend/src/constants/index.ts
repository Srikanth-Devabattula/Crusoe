/**
 * API base URL — must match where uploads are stored.
 * Local dev: http://localhost:5000/api (see frontend/.env.local)
 * Production: https://crusoe-nhbu.onrender.com/api
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://crusoe-nhbu.onrender.com/api"
    : "http://localhost:5000/api");

export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  servicesCadCam: "/services/cad-cam-cae-software-testing",
  servicesQuality: "/services/software-quality",
  servicesEngineering: "/services/engineering-services",
  servicesDevelopment: "/services/software-development",
  careers: "/careers",
  careerJob: (id: string) => `/careers/${id}`,
  testimonials: "/testimonials",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  blogNewsTab: (tab: "blog" | "news" = "blog") =>
    tab === "news" ? "/blog?tab=news" : "/blog",
  news: "/news",
  newsArticle: (slug: string) => `/news/${slug}`,
  contact: "/contact",
  thankYou: "/thank-you",
  admin: {
    login: "/admin/login",
    dashboard: "/admin/dashboard",
    blogs: "/admin/blogs",
    jobs: "/admin/jobs",
    news: "/admin/news",
    testimonials: "/admin/testimonials",
    team: "/admin/team",
    partners: "/admin/partners",
    contacts: "/admin/contacts",
    applications: "/admin/applications",
  },
} as const;

export const SITE_NAME = "Crusoe Tech";
