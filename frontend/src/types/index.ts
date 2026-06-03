export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export type AdminPermission =
  | "blogs"
  | "news"
  | "jobs"
  | "applications"
  | "contacts";

export type AdminPermissions = Record<AdminPermission, boolean>;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  permissions?: AdminPermissions;
}

export interface AdminUserRecord extends User {
  passwordPlain?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  permissions: AdminPermissions;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  password?: string;
  permissions?: AdminPermissions;
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
  featured: boolean;
  published: boolean;
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
  featured: boolean;
  published: boolean;
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
  featured: boolean;
  published: boolean;
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
  featured: boolean;
  published: boolean;
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
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resume?: File;
}

export interface JobApplication {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resume: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

export interface JobWithApplications {
  job: Pick<
    Job,
    "_id" | "title" | "experience" | "location" | "department" | "type"
  >;
  applications: JobApplication[];
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
