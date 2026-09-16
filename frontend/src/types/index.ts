export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export type AdminPermission =
  | "blogs"
  | "news"
  | "jobs"
  | "testimonials"
  | "team"
  | "partners"
  | "heroSlides"
  | "contacts"
  | "applications";

export type AdminPermissions = Record<AdminPermission, boolean>;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  permissions?: AdminPermissions;
}

export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: "staff";
  permissions: AdminPermissions;
  passwordPlain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffUserFormData {
  name: string;
  email: string;
  password?: string;
  permissions: AdminPermissions;
}

export interface BlogCategoryItem {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
}

export interface NewsCategoryItem {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  experience: string;
  location: string;
  department?: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  shortDescription: string;
  longDescription: string;
  experience: string;
  location: string;
  department?: string;
  type: Job["type"];
  published: boolean;
}

export interface Testimonial {
  _id: string;
  name: string;
  title: string;
  company?: string;
  quote?: string;
  photo?: string;
  rating: number;
  type: "text" | "video";
  videoUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialFormData {
  name: string;
  title: string;
  company?: string;
  quote?: string;
  photo?: string;
  rating: number;
  type: "text" | "video";
  videoUrl?: string;
  published: boolean;
  sortOrder?: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedIn?: string;
  twitter?: string;
  email?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedIn?: string;
  twitter?: string;
  email?: string;
  published: boolean;
  sortOrder?: number;
}

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerFormData {
  name: string;
  logo?: string;
  websiteUrl?: string;
  published: boolean;
  sortOrder?: number;
}

export interface HeroSlide {
  _id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  published: boolean;
  sortOrder: number;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlideFormData {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  published: boolean;
  sortOrder?: number;
  ctaLink?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  subject: string;
  message: string;
}

export type ContactStatus = "new" | "read" | "replied";

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  jobId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  resume?: File;
}

export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export type ApplicationType = "job" | "general";

export interface JobApplication {
  _id: string;
  job:
    | { _id: string; title: string; location?: string; experience?: string }
    | string
    | null;
  applicationType?: ApplicationType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  resume: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface OtpRequestData {
  email: string;
}

export interface OtpVerifyFormData {
  email: string;
  otp: string;
}

export interface OtpSentData {
  email: string;
  expiresIn: number;
  message?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
